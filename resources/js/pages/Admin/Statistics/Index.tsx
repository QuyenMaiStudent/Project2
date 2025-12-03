import { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useStatistics } from '@/hooks/useStatistics';
import AppLayout from '@/layouts/app-layout';
import SummaryCards from '@/components/Statistics/SummaryCards';
import RevenueChart from '@/components/Statistics/RevenueChart';
import ActivityTrendChart from '@/components/Statistics/ActivityTrendChart';
import type { StatisticsResponse } from '@/hooks/useStatistics';

const formatter = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });
const numberFormatter = new Intl.NumberFormat('vi-VN');

type Props = {
    initialStatistics: StatisticsResponse;
};

const StatisticsIndex = ({ initialStatistics }: Props) => {
    const initialFilters = useMemo(
        () => ({
            startDate: initialStatistics.filters.start_date,
            endDate: initialStatistics.filters.end_date,
            groupBy: initialStatistics.filters.group_by,
            preset: initialStatistics.filters.preset as StatisticsFilters['preset'],
        }),
        [initialStatistics],
    );

    const { data, loading, error, filters, updateFilters } = useStatistics({
        initialData: initialStatistics,
        initialFilters,
    });

    // derive month state from initialFilters
    const initialMonth = useMemo(() => {
        const sd = initialFilters.startDate;
        return sd ? sd.slice(0,7) : new Date().toISOString().slice(0,7);
    }, [initialFilters]);

    const [month, setMonth] = useState<string>(initialMonth);
    const groupByValue = filters.groupBy ?? data?.filters.group_by ?? 'day';

    const onMonthChange = (m: string) => {
        setMonth(m);
        const [y, mm] = m.split('-');
        const lastDay = new Date(Number(y), Number(mm), 0).getDate();
        const startDate = `${y}-${mm}-01`;
        const endDate = `${y}-${mm}-${String(lastDay).padStart(2,'0')}`;
        updateFilters({ startDate, endDate, preset: undefined });
    };

    const summaryCards = useMemo(() => {
        if (!data) return [];
        return [
            {
                label: 'Tổng doanh thu',
                value: formatter.format(data.summary.totalRevenue),
                hint: 'Doanh thu đã hoàn tất',
            },
            {
                label: 'Số đơn hàng',
                value: numberFormatter.format(data.summary.ordersCount),
                hint: 'Đơn hàng thành công',
            },
            {
                label: 'Giá trị trung bình',
                value: formatter.format(data.summary.averageOrderValue),
                hint: 'Giá trị trung bình mỗi đơn',
            },
            {
                label: 'Người dùng mới',
                value: numberFormatter.format(data.summary.newUsers),
                hint: 'Tài khoản mới trong kỳ',
            },
        ];
    }, [data]);

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Trang quản trị', href: '/admin/dashboard' },
                { title: 'Thống kê', href: '/admin/statistics' },
            ]}
        >
            <Head title="Thống kê quản trị" />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50 p-6">
                <div className="mx-auto max-w-7xl space-y-8">
                    <section className="rounded-2xl border border-blue-100 bg-white/80 p-6 shadow-lg backdrop-blur">
                        <div className="flex flex-wrap items-start gap-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Thống kê quản trị</h1>
                                <p className="mt-1 text-sm text-gray-500">
                                    Theo dõi hiệu suất kinh doanh, đơn hàng và người dùng
                                </p>
                            </div>

                            {/* --- CHANGED: month picker + group by (compact) --- */}
                            <div className="ml-auto flex items-center gap-4 rounded-xl border border-blue-100 bg-blue-50/60 p-4">
                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-500">Chọn tháng</label>
                                    <input
                                        type="month"
                                        className="rounded border px-3 py-2 text-sm"
                                        value={month}
                                        onChange={(e) => onMonthChange(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <label className="text-xs font-medium text-gray-500">Gộp theo</label>
                                    <select
                                        className="rounded border px-3 py-2 text-sm"
                                        value={groupByValue}
                                        onChange={(event) =>
                                            updateFilters({
                                                groupBy: event.target.value as 'day' | 'week' | 'month',
                                            })
                                        }
                                    >
                                        <option value="week">Tuần</option>
                                        <option value="month">Tháng</option>
                                    </select>
                                </div>
                            </div>
                            {/* --- end changed --- */}
                        </div>

                        {error && (
                            <div className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                Không thể tải dữ liệu: {error}
                            </div>
                        )}
                    </section>

                    <section className="space-y-6">
                        <SummaryCards cards={summaryCards} loading={loading} />
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div className="lg:col-span-2 rounded-lg border bg-white p-5 shadow-sm">
                                <RevenueChart
                                    title="Doanh thu theo thời gian"
                                    labels={data?.revenue.labels ?? []}
                                    dataset={data?.revenue.dataset ?? []}
                                    loading={loading}
                                    formatter={(value) => formatter.format(value)}
                                />
                            </div>

                            <div className="rounded-lg border bg-white p-5 shadow-sm">
                                <ActivityTrendChart
                                    title="Hoạt động người dùng & đơn hàng"
                                    labels={data?.activity.labels ?? []}
                                    series={data?.activity.series ?? []}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
};

export default StatisticsIndex;