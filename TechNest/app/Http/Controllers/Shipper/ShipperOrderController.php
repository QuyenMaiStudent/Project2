<?php

namespace App\Http\Controllers\Shipper;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use App\Notifications\OrderPickedUp;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class ShipperOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $shipperId = $request->user('shipper')->id;

        $orders = Order::query()
            ->with('shippingAddress')
            ->where(function ($query) use ($shipperId) {
                $query->readyForShipper()
                    ->orWhere('shipper_id', $shipperId);
            })
            ->orderByDesc('status')
            ->orderByDesc('placed_at')
            ->paginate(15)
            ->through(function (Order $order) use ($shipperId) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                    'shipping_address' => $order->shippingAddress?->address_line,
                    'is_assigned_to_me' => $order->shipper_id === $shipperId,
                    'can_accept' => $order->status === Order::STATUS_READY_TO_SHIP,
                    'can_mark_delivered' => $order->shipper_id === $shipperId && $order->status === Order::STATUS_IN_DELIVERY,
                ];
            });

        return Inertia::render('Shipper/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $shipper = $request->user('shipper');

        if ($order->status !== Order::STATUS_READY_TO_SHIP && $order->shipper_id !== $shipper->id) {
            abort(403);
        }

        $order->load([
            'items.product.primaryImage',
            'items.variant',
            'shippingAddress.province',
            'shippingAddress.district',
            'shippingAddress.ward',
        ]);

        return Inertia::render('Shipper/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                'shipping_address' => $order->shippingAddress ? [
                    'recipient_name' => $order->shippingAddress->recipient_name,
                    'phone' => $order->shippingAddress->phone,
                    'full_address' => implode(', ', array_filter([
                        $order->shippingAddress->address_line,
                        optional($order->shippingAddress->ward)->name,
                        optional($order->shippingAddress->district)->name,
                        optional($order->shippingAddress->province)->name,
                    ])),
                ] : null,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product?->name,
                        'variant_name' => $item->variant?->variant_name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->price,
                    ];
                })->values(),
                'can_accept' => $order->status === Order::STATUS_READY_TO_SHIP,
                'can_mark_delivered' => $order->shipper_id === $shipper->id && $order->status === Order::STATUS_IN_DELIVERY,
            ],
        ]);
    }

    public function accept(Request $request, Order $order): RedirectResponse
    {
        $shipper = $request->user('shipper');

        if ($order->status !== Order::STATUS_READY_TO_SHIP) {
            abort(422, 'Đơn hàng không ở trạng thái chờ lấy.');
        }

        $order->forceFill([
            'status' => Order::STATUS_IN_DELIVERY,
            'shipper_id' => $shipper->id,
            'shipped_at' => Carbon::now(),
        ])->save();

        $sellerIds = $order->items()
            ->with('product')
            ->get()
            ->pluck('product.created_by')
            ->filter()
            ->unique()
            ->all();

        $sellers = User::whereIn('id', $sellerIds)->get();

        Notification::send($sellers, new OrderPickedUp($order));

        return back()->with('success', 'Bạn đã nhận đơn thành công.');
    }

    public function markDelivered(Request $request, Order $order): RedirectResponse
    {
        $shipper = $request->user('shipper');

        if ($order->shipper_id !== $shipper->id) {
            abort(403);
        }

        if ($order->status !== Order::STATUS_IN_DELIVERY) {
            abort(422, 'Đơn hàng không ở trạng thái đang giao.');
        }

        $order->forceFill([
            'status' => Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
            'delivered_at' => Carbon::now(),
        ])->save();

        return back()->with('success', 'Đã cập nhật trạng thái giao xong, chờ khách xác nhận.');
    }
}
