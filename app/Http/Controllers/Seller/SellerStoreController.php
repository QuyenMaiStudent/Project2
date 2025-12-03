<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Http\Requests\Seller\UpdateStoreLocationRequest;
use App\Models\SellerStore;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\JsonResponse;

class SellerStoreController extends Controller
{
    public function show(Request $request): JsonResponse|Response
    {
        $store = SellerStore::firstWhere('seller_id', $request->user()->id);
        $distance = null;

        if ($store && $request->filled(['buyer_lat', 'buyer_lng'])) {
            $distance = round($store->distanceTo(
                (float) $request->query('buyer_lat'),
                (float) $request->query('buyer_lng')
            ), 3);
        }

        $payload = [
            'store' => $store,
            'fallback' => [
                'latitude' => 21.028511,
                'longitude' => 105.804817,
            ],
            'distance_km' => $distance,
        ];

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json($payload);
        }

        return Inertia::render('Seller/Stores/Index', [
            'store' => $store,
            'fallback' => $payload['fallback'],
        ]);
    }

    public function update(UpdateStoreLocationRequest $request): JsonResponse|RedirectResponse
    {
        $store = SellerStore::updateOrCreate(
            ['seller_id' => $request->user()->id],
            $request->validated()
        );

        if ($request->wantsJson() && !$request->header('X-Inertia')) {
            return response()->json([
                'message' => 'Store location saved.',
                'store' => $store,
            ]);
        }

        return back()->with('success', 'Store location saved.');
    }
}
