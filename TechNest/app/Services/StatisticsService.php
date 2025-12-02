<?php

namespace App\Services;

use App\Models\Order;
use App\Models\User;
use Illuminate\Support\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Schema;

class StatisticsService
{
    protected array $successfulStatuses;
    protected ?string $revenueColumn = null;

    public function __construct()
    {
        $this->successfulStatuses = config('statistics.orders.success_statuses', ['completed', 'delivered', 'shipped']);
    }

    public function getStatistics(array $filters): array
    {
        [$start, $end] = $this->normalizeRange($filters);
        $groupBy = $filters['group_by'] ?? 'day';

        return [
            'filters' => [
                'start_date' => $start->toDateString(),
                'end_date' => $end->toDateString(),
                'group_by' => $groupBy,
                'preset' => $filters['preset'] ?? null,
            ],
            'summary' => $this->getSummaryMetrics($start, $end),
            'revenue' => $this->getRevenueSeries($start, $end, $groupBy),
            'activity' => $this->getActivitySeries($start, $end, $groupBy),
        ];
    }

    protected function normalizeRange(array $filters): array
    {
        $start = Carbon::parse($filters['start_date'])->startOfDay();
        $end = Carbon::parse($filters['end_date'])->endOfDay();

        if ($start->greaterThan($end)) {
            [$start, $end] = [$end->copy()->startOfDay(), $start->copy()->endOfDay()];
        }

        return [$start, $end];
    }

    protected function getSummaryMetrics(Carbon $start, Carbon $end): array
    {
        $revenueColumn = $this->getRevenueColumn();

        $orderQuery = Order::query()
            ->whereBetween('created_at', [$start, $end])
            ->when(
                !empty($this->successfulStatuses),
                fn ($query) => $query->whereIn('status', $this->successfulStatuses)
            );

        $totalRevenue = (float) (clone $orderQuery)->sum($revenueColumn);
        $ordersCount = (int) (clone $orderQuery)->count();
        $newUsers = (int) User::query()
            ->whereBetween('created_at', [$start, $end])
            ->count();

        $averageOrderValue = $ordersCount > 0 ? round($totalRevenue / $ordersCount, 2) : 0.0;

        return [
            'totalRevenue' => $totalRevenue,
            'ordersCount' => $ordersCount,
            'averageOrderValue' => $averageOrderValue,
            'newUsers' => $newUsers,
        ];
    }

    protected function getRevenueSeries(Carbon $start, Carbon $end, string $groupBy): array
    {
        $buckets = $this->buildEmptyBuckets($start, $end, $groupBy);
        $revenueColumn = $this->getRevenueColumn();
        $format = $this->resolveDateFormat($groupBy);
        $wrappedColumn = $this->wrapColumn($revenueColumn);

        $rows = Order::query()
            ->when(
                !empty($this->successfulStatuses),
                fn ($query) => $query->whereIn('status', $this->successfulStatuses)
            )
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("DATE_FORMAT(created_at, '{$format}') as period, SUM(COALESCE({$wrappedColumn}, 0)) as revenue")
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $dataset = [];
        foreach ($buckets as $key => $_label) {
            $dataset[] = (float) ($rows[$key]->revenue ?? 0);
        }

        return [
            'labels' => array_values($buckets),
            'dataset' => $dataset,
        ];
    }

    protected function getActivitySeries(Carbon $start, Carbon $end, string $groupBy): array
    {
        $buckets = $this->buildEmptyBuckets($start, $end, $groupBy);
        $format = $this->resolveDateFormat($groupBy);
        $revenueColumn = $this->getRevenueColumn();
        $wrappedColumn = $this->wrapColumn($revenueColumn);

        $orderRows = Order::query()
            ->when(
                !empty($this->successfulStatuses),
                fn ($query) => $query->whereIn('status', $this->successfulStatuses)
            )
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("DATE_FORMAT(created_at, '{$format}') as period, COUNT(*) as order_count, SUM(COALESCE({$wrappedColumn}, 0)) as revenue")
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $userRows = User::query()
            ->whereBetween('created_at', [$start, $end])
            ->selectRaw("DATE_FORMAT(created_at, '{$format}') as period, COUNT(*) as user_count")
            ->groupBy('period')
            ->orderBy('period')
            ->get()
            ->keyBy('period');

        $labels = array_values($buckets);
        $ordersSeries = [];
        $revenueSeries = [];
        $usersSeries = [];

        foreach ($buckets as $key => $_label) {
            $ordersSeries[] = (int) ($orderRows[$key]->order_count ?? 0);
            $revenueSeries[] = (float) ($orderRows[$key]->revenue ?? 0);
            $usersSeries[] = (int) ($userRows[$key]->user_count ?? 0);
        }

        return [
            'labels' => $labels,
            'series' => [
                ['name' => 'Orders', 'data' => $ordersSeries],
                ['name' => 'Revenue', 'data' => $revenueSeries],
                ['name' => 'New Users', 'data' => $usersSeries],
            ],
        ];
    }

    protected function buildEmptyBuckets(Carbon $start, Carbon $end, string $groupBy): array
    {
        $period = match ($groupBy) {
            'month' => CarbonPeriod::create($start->copy()->startOfMonth(), '1 month', $end->copy()->endOfMonth()),
            'week' => CarbonPeriod::create($start->copy()->startOfWeek(), '1 week', $end->copy()->endOfWeek()),
            default => CarbonPeriod::create($start->copy()->startOfDay(), '1 day', $end->copy()->endOfDay()),
        };

        $keyFormat = $this->resolveMomentKey($groupBy);
        $displayFormat = $this->resolveDisplayFormat($groupBy);

        $buckets = [];
        foreach ($period as $date) {
            $key = $date->format($keyFormat);
            $buckets[$key] = $date->format($displayFormat);
        }

        return $buckets;
    }

    protected function resolveDateFormat(string $groupBy): string
    {
        return match ($groupBy) {
            'month' => '%Y-%m',
            'week' => '%x-W%v',
            default => '%Y-%m-%d',
        };
    }

    protected function resolveMomentKey(string $groupBy): string
    {
        return match ($groupBy) {
            'month' => 'Y-m',
            'week' => 'o-\WW',
            default => 'Y-m-d',
        };
    }

    protected function resolveDisplayFormat(string $groupBy): string
    {
        return match ($groupBy) {
            'month' => 'M Y',
            'week' => '\W\e\e\k W, o',
            default => 'd/m',
        };
    }

    protected function getRevenueColumn(): string
    {
        if ($this->revenueColumn) {
            return $this->revenueColumn;
        }

        $candidates = config('statistics.orders.amount_columns', ['total_amount', 'grand_total', 'total_price', 'total']);
        foreach ($candidates as $column) {
            if (Schema::hasColumn('orders', $column)) {
                return $this->revenueColumn = $column;
            }
        }

        return $this->revenueColumn = 'total_amount';
    }

    protected function wrapColumn(string $column): string
    {
        return sprintf('`%s`', str_replace('`', '', $column));
    }
}