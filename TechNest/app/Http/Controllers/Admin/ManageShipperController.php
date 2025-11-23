<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Shipper;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ManageShipperController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->get('search');

        $shippers = Shipper::query()
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%")
                        ->orWhere('phone', 'like', "%{$search}%");
                });
            })
            ->withCount([
                'orders as total_orders',
                'orders as delivered_orders' => function ($query) {
                    $query->where('status', Order::STATUS_DELIVERED);
                },
                'orders as in_delivery_orders' => function ($query) {
                    $query->where('status', Order::STATUS_IN_DELIVERY);
                },
            ])
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (Shipper $shipper) {
                return [
                    'id' => $shipper->id,
                    'name' => $shipper->name,
                    'email' => $shipper->email,
                    'phone' => $shipper->phone,
                    'total_orders' => $shipper->total_orders ?? 0,
                    'delivered_orders' => $shipper->delivered_orders ?? 0,
                    'in_delivery_orders' => $shipper->in_delivery_orders ?? 0,
                    'created_at' => $shipper->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Admin/Shippers/Index', [
            'shippers' => $shippers,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(Shipper $shipper): Response
    {
        $shipper->loadCount([
            'orders as total_orders',
            'orders as delivered_orders' => function ($query) {
                $query->where('status', Order::STATUS_DELIVERED);
            },
            'orders as in_delivery_orders' => function ($query) {
                $query->where('status', Order::STATUS_IN_DELIVERY);
            },
            'orders as ready_to_ship_orders' => function ($query) {
                $query->where('status', Order::STATUS_READY_TO_SHIP);
            },
        ]);

        $recentOrders = $shipper->orders()
            ->with(['user', 'shippingAddress'])
            ->orderByDesc('created_at')
            ->limit(10)
            ->get()
            ->map(function (Order $order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'customer_name' => $order->user?->name,
                    'shipping_address' => $order->shippingAddress?->address_line,
                    'total_amount' => (float) $order->total_amount,
                    'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                    'shipped_at' => $order->shipped_at?->format('d/m/Y H:i'),
                    'delivered_at' => $order->delivered_at?->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Admin/Shippers/Show', [
            'shipper' => [
                'id' => $shipper->id,
                'name' => $shipper->name,
                'email' => $shipper->email,
                'phone' => $shipper->phone,
                'total_orders' => $shipper->total_orders ?? 0,
                'delivered_orders' => $shipper->delivered_orders ?? 0,
                'in_delivery_orders' => $shipper->in_delivery_orders ?? 0,
                'ready_to_ship_orders' => $shipper->ready_to_ship_orders ?? 0,
                'created_at' => $shipper->created_at->format('d/m/Y H:i'),
                'email_verified_at' => $shipper->email_verified_at?->format('d/m/Y H:i'),
            ],
            'recentOrders' => $recentOrders,
        ]);
    }
}
