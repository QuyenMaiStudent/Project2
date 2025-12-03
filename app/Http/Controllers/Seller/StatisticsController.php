<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\SellerStatisticsRequest;
use App\Services\SellerStatisticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StatisticsController extends Controller
{
    protected SellerStatisticsService $statistics;

    public function __construct(SellerStatisticsService $statistics)
    {
        $this->statistics = $statistics;
    }

    public function index(SellerStatisticsRequest $request)
    {
        $filters = $request->validated();
        $filters['seller_id'] = $request->user()->id;

        $stats = $this->statistics->getStatistics($filters);

        // Only return plain JSON for true API/ajax calls (not Inertia requests)
        if (($request->wantsJson() || $request->ajax()) && ! $request->header('X-Inertia')) {
            return response()->json($stats);
        }

        // Always return an Inertia response for Inertia navigation
        return Inertia::render('Seller/Statistics/Index', [
            'initialData' => $stats,
        ]);
    }
}
