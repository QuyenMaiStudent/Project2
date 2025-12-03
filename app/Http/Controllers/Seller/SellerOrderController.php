<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Redirect;

class SellerOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $sellerId = $request->user()->id;

        $orders = Order::query()
            ->whereHas('items.product', fn ($query) => $query->where('created_by', $sellerId))
            ->with([
                'items' => fn ($query) => $query
                    ->whereHas('product', fn ($q) => $q->where('created_by', $sellerId))
                    // eager-load variant.image so we can use variant image when available
                    ->with(['product.primaryImage', 'variant.image']),
                'payment',
            ])
            ->orderByDesc('placed_at')
            ->orderByDesc('created_at')
            ->paginate(15)
            ->through(function (Order $order) {
                $sellerItems = $order->items;
                $subtotal = $sellerItems->sum(fn ($item) => $item->quantity * $item->price);

                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'payment_status' => $order->payment?->status ?? 'pending',
                    'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                    'items_count' => $sellerItems->count(),
                    'subtotal' => (float) $subtotal,
                ];
            });

        return Inertia::render('Seller/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        $sellerId = $request->user()->id;

        $order->load([
            'items' => fn ($query) => $query
                ->whereHas('product', fn ($q) => $q->where('created_by', $sellerId))
                // ensure variant.image is loaded
                ->with(['product.primaryImage', 'variant.image']),
            'payment.method',
            'shippingAddress.province',
            'shippingAddress.ward',
            'promotion',
        ]);

        if ($order->items->isEmpty()) {
            abort(403);
        }

        $subtotal = $order->items->sum(fn ($item) => $item->quantity * $item->price);
        $address = $order->shippingAddress;

        $shippingAddress = $address ? [
            'recipient_name' => $address->recipient_name,
            'phone' => $address->phone,
            'full_address' => implode(', ', array_filter([
                $address->address_line,
                optional($address->ward)->name,
                optional($address->province)->name,
            ])),
        ] : null;

        return Inertia::render('Seller/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'payment_status' => $order->payment?->status ?? 'pending',
                'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                'subtotal' => (float) $subtotal,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product?->name,
                        // ưu tiên ảnh của variant nếu có, ngược lại dùng primary image của product
                        'product_image' => $item->variant?->image?->url ?? $item->product?->primaryImage?->url,
                        'variant_name' => $item->variant?->variant_name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->price,
                        'subtotal' => (float) ($item->price * $item->quantity),
                    ];
                })->values(),
                'shipping_address' => $shippingAddress,
                'promotion' => $order->promotion ? [
                    'code' => $order->promotion->code,
                    'type' => $order->promotion->type,
                    'value' => (float) $order->promotion->value,
                ] : null,
                'can_fulfill' => in_array($order->status, [Order::STATUS_PAID, Order::STATUS_READY_TO_SHIP], true),
            ],
        ]);
    }

    public function requestShipment(Request $request, Order $order): RedirectResponse
    {
        $sellerId = $request->user()->id;

        $hasSellerItems = $order->items()
            ->whereHas('product', fn ($query) => $query->where('created_by', $sellerId))
            ->exists();

        if (! $hasSellerItems) {
            abort(403);
        }

        if (! in_array($order->status, [Order::STATUS_PAID, Order::STATUS_READY_TO_SHIP], true)) {
            abort(422, 'Đơn hàng chưa sẵn sàng để lên đơn.');
        }

        $order->update([
            'status' => Order::STATUS_READY_TO_SHIP,
            'shipper_id' => null,
        ]);

        return Redirect::back()->with('success', 'Đơn hàng đã được gửi tới shipper.');
    }
}
