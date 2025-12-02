<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StatisticsFilterRequest;
use Illuminate\Http\Request;
use App\Services\StatisticsService;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminStatisticsController extends Controller
{
    public function index(StatisticsFilterRequest $request, StatisticsService $statisticsService): Response
    {
        $statistics = $statisticsService->getStatistics($request->validated());

        return Inertia::render('Admin/Statistics/Index', [
            'initialStatistics' => $statistics,
        ]);
    }

    public function data(StatisticsFilterRequest $request, StatisticsService $statisticsService): JsonResponse
    {
        $statistics = $statisticsService->getStatistics($request->validated());

        return response()->json($statistics);
    }
}
