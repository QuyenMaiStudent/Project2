<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderTrackingController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->whereIn('status', [
                Order::STATUS_READY_TO_SHIP,
                Order::STATUS_IN_DELIVERY,
                Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
            ])
            // load variant image as well so we can prefer variant image when present
            ->with(['items.product.primaryImage', 'items.variant.image', 'shipper'])
            ->orderByDesc('placed_at')
            ->paginate(15)
            ->through(function (Order $order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'status_label' => $this->getStatusLabel($order->status),
                    'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                    'items_count' => $order->items->count(),
                    // ưu tiên ảnh variant, nếu không có thì dùng product primary image
                    'first_product_image' => optional($order->items->first()?->variant?->image)?->url
                                            ?? optional($order->items->first()?->product?->primaryImage)?->url,
                    'shipper_name' => $order->shipper?->name,
                ];
            });

        return Inertia::render('Customer/Tracking/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Request $request, Order $order): Response
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }

        $order->load([
            // ensure variant image is loaded
            'items.product.primaryImage',
            'items.variant.image',
            'shippingAddress.province',
            'shippingAddress.ward',
            'shipper',
            'statusLogs' => fn($query) => $query->orderBy('created_at', 'asc'),
        ]);

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

        return Inertia::render('Customer/Tracking/Show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'status_label' => $this->getStatusLabel($order->status),
                'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                'shipped_at' => $order->shipped_at?->format('d/m/Y H:i'),
                'delivered_at' => $order->delivered_at?->format('d/m/Y H:i'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'product_name' => $item->product?->name,
                        // ưu tiên ảnh của variant khi có
                        'product_image' => $item->variant?->image?->url ?? $item->product?->primaryImage?->url,
                        'variant_name' => $item->variant?->variant_name,
                        'quantity' => $item->quantity,
                    ];
                })->values(),
                'shipping_address' => $shippingAddress,
                'shipper' => $order->shipper ? [
                    'name' => $order->shipper->name,
                    'phone' => $order->shipper->phone,
                ] : null,
                'tracking' => $this->getOrderTracking($order),
                'can_confirm_delivery' => $order->status === Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
            ],
        ]);
    }

    private function getStatusLabel(string $status): string
    {
        return match($status) {
            Order::STATUS_READY_TO_SHIP => 'Sẵn sàng giao hàng',
            Order::STATUS_IN_DELIVERY => 'Đang giao hàng',
            Order::STATUS_DELIVERED_AWAITING_CONFIRMATION => 'Đã giao - Chờ xác nhận',
            Order::STATUS_DELIVERED => 'Đã giao hàng',
            default => 'Không xác định',
        };
    }

    private function getOrderTracking(Order $order): array
    {
        $steps = [
            [
                'status' => Order::STATUS_PLACED,
                'label' => 'Đơn hàng đã đặt',
                'completed' => true,
                'timestamp' => $order->placed_at?->format('d/m/Y H:i'),
            ],
            [
                'status' => Order::STATUS_PAID,
                'label' => 'Đã thanh toán',
                'completed' => true,
                'timestamp' => $order->payment?->paid_at?->format('d/m/Y H:i'),
            ],
            [
                'status' => Order::STATUS_READY_TO_SHIP,
                'label' => 'Sẵn sàng giao hàng',
                'completed' => in_array($order->status, [
                    Order::STATUS_READY_TO_SHIP,
                    Order::STATUS_IN_DELIVERY,
                    Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
                    Order::STATUS_DELIVERED,
                ]),
                'timestamp' => $this->getStatusTimestamp($order, Order::STATUS_READY_TO_SHIP),
            ],
            [
                'status' => Order::STATUS_IN_DELIVERY,
                'label' => 'Đang giao hàng',
                'completed' => in_array($order->status, [
                    Order::STATUS_IN_DELIVERY,
                    Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
                    Order::STATUS_DELIVERED,
                ]),
                'timestamp' => $order->shipped_at?->format('d/m/Y H:i'),
            ],
            [
                'status' => Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
                'label' => 'Đã giao - Chờ xác nhận',
                'completed' => in_array($order->status, [
                    Order::STATUS_DELIVERED_AWAITING_CONFIRMATION,
                    Order::STATUS_DELIVERED,
                ]),
                'timestamp' => $this->getStatusTimestamp($order, Order::STATUS_DELIVERED_AWAITING_CONFIRMATION),
            ],
            [
                'status' => Order::STATUS_DELIVERED,
                'label' => 'Hoàn thành',
                'completed' => $order->status === Order::STATUS_DELIVERED,
                'timestamp' => $order->delivered_at?->format('d/m/Y H:i'),
            ],
        ];

        return $steps;
    }

    private function getStatusTimestamp(Order $order, string $status): ?string
    {
        $log = $order->statusLogs->firstWhere('status', $status);
        return $log?->created_at?->format('d/m/Y H:i');
    }
}
