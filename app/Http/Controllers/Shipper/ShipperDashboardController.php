<?php

namespace App\Http\Controllers\Shipper;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ShipperDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $shipper = $request->user('shipper');

        $metrics = [
            'ready_to_ship' => Order::where('status', Order::STATUS_READY_TO_SHIP)->count(),
            'my_in_delivery' => Order::where('shipper_id', $shipper->id)->where('status', Order::STATUS_IN_DELIVERY)->count(),
            'awaiting_confirmation' => Order::where('shipper_id', $shipper->id)->where('status', Order::STATUS_DELIVERED_AWAITING_CONFIRMATION)->count(),
            'delivered_today' => Order::where('shipper_id', $shipper->id)
                ->where('status', Order::STATUS_DELIVERED)
                ->whereDate('delivered_at', now()->toDateString())
                ->count(),
        ];

        $recent = Order::query()
            // include item images so dashboard can show a thumbnail
            ->where('shipper_id', $shipper->id)
            ->with(['items.product.primaryImage', 'items.variant.image'])
            ->orderByDesc('updated_at')
            ->limit(10)
            ->get()
            ->map(fn ($o) => [
                'id' => $o->id,
                'status' => $o->status,
                'updated_at' => $o->updated_at?->format('d/m H:i'),
                'thumbnail' => optional($o->items->first()?->variant?->image)?->url
                                ?? optional($o->items->first()?->product?->primaryImage)?->url,
            ]);

        return Inertia::render('Shipper/Dashboard', [
            'metrics' => $metrics,
            'recent_orders' => $recent,
            'shipper' => [
                'id' => $shipper->id,
                'name' => $shipper->name,
                'email' => $shipper->email,
                'phone' => $shipper->phone,
            ],
        ]);
    }
}
