<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\PaymentMethod;
use App\Models\Promotion;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Payment;

class OrderController extends Controller
{
    /**
     * Thực hiện tạo order và chuyển tới cổng thanh toán
     */
    public function placeOrder(Request $request)
    {
        Log::info('=== PLACE ORDER METHOD CALLED ===', [
            'user_id' => Auth::id(),
            'method' => $request->method(),
            'url' => $request->url(),
            'all_data' => $request->all(),
            'headers' => $request->headers->all()
        ]);

        try {
            Log::info('Starting validation...');

            $data = $request->validate([
                'shipping_address_id' => ['required', 'exists:shipping_addresses,id'],
                'payment_method_id' => ['required', 'exists:payment_methods,id'],
                'promotion_id' => ['nullable', 'exists:promotions,id'],
                'cart_item_id' => ['nullable', 'integer'],
            ]);

            Log::info('Validation passed', ['validated_data' => $data]);

            $shippingAddress = ShippingAddress::where('id', $data['shipping_address_id'])
                ->where('user_id', Auth::id())
                ->first();

            if (!$shippingAddress) {
                return back()->withErrors(['shipping_address_id' => 'Địa chỉ không hợp lệ']);
            }

            $paymentMethod = PaymentMethod::findOrFail($data['payment_method_id']);

            $cart = Cart::with(['items.product', 'items.variant'])
                ->where('user_id', Auth::id())
                ->first();

            if (!$cart || $cart->items->isEmpty()) {
                return redirect()->route('cart.index')->with('error', 'Giỏ hàng trống');
            }

            if (!empty($data['cart_item_id'])) {
                $selectedItems = $cart->items->filter(fn($it) => $it->id == $data['cart_item_id']);
            } else {
                $selectedItems = $cart->items;
            }

            if ($selectedItems->isEmpty()) {
                return redirect()->route('cart.index')->with('error', 'Không có sản phẩm nào được chọn');
            }

            $total = $selectedItems->sum(fn($item) => $this->calculateItemPrice($item) * $item->quantity);

            $appliedPromotion = null;
            $discountAmount = 0;
            if (!empty($data['promotion_id'])) {
                $result = $this->validateAndCalculatePromotion($data['promotion_id'], $selectedItems, $total);
                if (empty($result['valid'])) {
                    return back()->withErrors(['promotion_id' => $result['error'] ?? 'Mã khuyến mãi không hợp lệ']);
                }
                $appliedPromotion = $result['promotion'];
                $discountAmount = $result['discount'];
            }

            $finalTotal = max(0, $total - $discountAmount);

            $order = DB::transaction(function () use (
                $cart,
                $shippingAddress,
                $paymentMethod,
                $appliedPromotion,
                $discountAmount,
                $finalTotal,
                $selectedItems
            ) {
                $orderData = [
                    'user_id' => Auth::id(),
                    'status' => 'placed',
                    'total_amount' => $finalTotal,
                    'placed_at' => now(),
                    'shipping_address_id' => $shippingAddress->id,
                ];

                if (!empty($appliedPromotion)) {
                    $orderData['promotion_id'] = $appliedPromotion->id;
                    $orderData['discount_amount'] = $discountAmount;
                }

                $order = Order::create($orderData);

                foreach ($selectedItems as $item) {
                    $price = $this->calculateItemPrice($item);

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'product_variant_id' => $item->product_variant_id,
                        'quantity' => $item->quantity,
                        'price' => $price,
                    ]);

                    // KHÔNG XÓA ITEM Ở ĐÂY
                    // Items sẽ được xóa trong webhook khi thanh toán thành công
                }

                // Tạo payment record với status pending (dùng Eloquent để dễ truy xuất id)
                Payment::create([
                    'order_id' => $order->id,
                    'payment_method_id' => $paymentMethod->id,
                    // store provider normalized to lowercase to avoid case-mismatch later
                    'provider' => strtolower($paymentMethod->provider ?? 'unknown'),
                    'amount' => $finalTotal,
                    'status' => 'pending',
                ]);

                // Không cập nhật order status thành 'paid' ở đây
                // Order sẽ được cập nhật qua webhook sau khi thanh toán thành công

                Log::info('Order created successfully', [
                    'order_id' => $order->id,
                    'total' => $finalTotal
                ]);

                return $order;
            });

            // reload relations so gateway can access item->product safely
            $order->load('items.product', 'items.variant');

            // Validate provider and create gateway (catch unsupported provider early)
            try {
                if (empty($paymentMethod->provider)) {
                    throw new \InvalidArgumentException('Invalid payment provider');
                }
                $gateway = \App\Services\PaymentService::make($paymentMethod->provider);
            } catch (\Throwable $e) {
                Log::error('Payment provider error', ['provider' => $paymentMethod->provider ?? null, 'error' => $e->getMessage()]);
                return back()->withErrors(['payment_method_id' => 'Phương thức thanh toán không hợp lệ. Vui lòng thử lại hoặc chọn phương thức khác.']);
            }

            // Tạo payment URL
            $paymentUrl = $gateway->createPayment($order);

            Log::info('Payment URL created', [
                'order_id' => $order->id,
                'url' => $paymentUrl,
                'provider' => $paymentMethod->provider
            ]);

            // Luôn redirect external
            return Inertia::location($paymentUrl);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('=== VALIDATION FAILED ===', [
                'user_id' => Auth::id(),
                'errors' => $e->errors(),
                'input' => $request->all()
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('=== PLACE ORDER EXCEPTION ===', [
                'user_id' => Auth::id(),
                'error_message' => $e->getMessage(),
                'error_file' => $e->getFile(),
                'error_line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            // trả về message chung, chi tiết đã được log
            return back()->withErrors([
                'payment' => 'Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại hoặc liên hệ hỗ trợ.'
            ]);
        }
    }

    /**
     * Hiển thị danh sách đơn hàng
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['items.product.primaryImage', 'items.variant', 'payment', 'shippingAddress'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'status' => $order->status,
                    'total_amount' => $order->total_amount,
                    'discount_amount' => $order->discount_amount ?? 0,
                    'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                    'items_count' => $order->items->count(),
                    'payment_status' => $order->payment?->status ?? 'pending',
                ];
            });

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Hiển thị chi tiết đơn hàng
     */
    public function show(Order $order)
    {
        if ($order->user_id !== Auth::id()) {
            abort(403, 'Unauthorized access to order');
        }

        $order->load([
            'items.product.primaryImage',
            'items.variant.image',
            'payment.method',
            'shippingAddress.province',
            'shippingAddress.district',
            'shippingAddress.ward',
            'promotion',
            'statusLogs'
        ]);

        return Inertia::render('Customer/Orders/Show', [
            'order' => [
                'id' => $order->id,
                'status' => $order->status,
                'total_amount' => $order->total_amount,
                'discount_amount' => $order->discount_amount ?? 0,
                'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                'items' => $order->items->map(function ($item) {
                    return [
                        'product' => [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'image' => $item->product->primaryImage->url ?? null,
                        ],
                        'variant' => $item->variant ? [
                            'id' => $item->variant->id,
                            'name' => $item->variant->variant_name,
                            'image' => optional($item->variant->image)->url ?? null,
                        ] : null,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->price * $item->quantity,
                    ];
                }),
                'shipping_address' => [
                    'recipient_name' => $order->shippingAddress->recipient_name,
                    'phone' => $order->shippingAddress->phone,
                    'full_address' => $this->formatFullAddress($order->shippingAddress),
                ],
                'payment' => [
                    'status' => $order->payment?->status ?? 'pending',
                    'method' => $order->payment?->method?->name ?? 'N/A',
                    'provider' => $order->payment?->provider ?? 'N/A',
                    'transaction_id' => $order->payment?->transaction_id ?? null,
                    'paid_at' => $order->payment?->paid_at?->format('d/m/Y H:i') ?? null,
                ],
                'promotion' => $order->promotion ? [
                    'code' => $order->promotion->code,
                    'type' => $order->promotion->type,
                    'value' => $order->promotion->value,
                ] : null,
            ],
        ]);
    }

    private function calculateItemPrice($item): float
    {
        if ($item->variant) {
            if ($item->variant->price !== null) {
                return (float) $item->variant->price;
            }
            return (float) ($item->product->price ?? 0) + (float) ($item->variant->additional_price ?? 0);
        }

        return (float) ($item->product->price ?? 0);
    }

    private function formatFullAddress($address): string
    {
        $parts = [
            $address->address_line,
            optional($address->ward)->name,
            optional($address->district)->name,
            optional($address->province)->name,
        ];

        return implode(', ', array_filter($parts));
    }

    private function validateAndCalculatePromotion($promotionId, $selectedItems, $total): array
    {
        $promotion = Promotion::with('conditions')->find($promotionId);

        if (!$promotion) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi không tồn tại.'];
        }

        if (!$promotion->is_active) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi không còn hiệu lực.'];
        }

        if ($promotion->starts_at && $promotion->starts_at > now()) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi chưa có hiệu lực.'];
        }

        if ($promotion->expires_at && $promotion->expires_at < now()) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi đã hết hạn.'];
        }

        if ($promotion->usage_limit !== null && $promotion->used_count >= $promotion->usage_limit) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi đã hết lượt sử dụng.'];
        }

        if ($promotion->min_order_amount && $total < $promotion->min_order_amount) {
            return ['valid' => false, 'error' => 'Đơn hàng chưa đủ giá trị tối thiểu để áp dụng mã.'];
        }

        // ensure we reliably extract seller ids from related product
        $sellerIds = $selectedItems->map(function ($it) {
            return $it->product?->created_by ?? null;
        })->filter()->unique()->values()->all();
        if ($promotion->seller_id !== null && !in_array($promotion->seller_id, $sellerIds, true)) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi không áp dụng cho sản phẩm trong giỏ.'];
        }

        $productIds = $selectedItems->pluck('product_id')->unique()->values()->all();
        $brandIds = $selectedItems->pluck('product.brand_id')->filter()->unique()->values()->all();
        $categoryIds = $selectedItems->flatMap(fn($item) => $item->product->categories->pluck('id'))
            ->unique()
            ->values()
            ->all();

        $conds = $promotion->conditions;
        if ($conds->isNotEmpty()) {
            $applicable = false;
            foreach ($conds as $c) {
                if ($c->condition_type === 'product' && in_array($c->target_id, $productIds, true)) {
                    $applicable = true;
                    break;
                }
                if ($c->condition_type === 'brand' && in_array($c->target_id, $brandIds, true)) {
                    $applicable = true;
                    break;
                }
                if ($c->condition_type === 'category' && in_array($c->target_id, $categoryIds, true)) {
                    $applicable = true;
                    break;
                }
            }

            if (!$applicable) {
                return ['valid' => false, 'error' => 'Mã khuyến mãi không áp dụng cho sản phẩm trong giỏ.'];
            }
        }

        $discount = 0;
        if ($promotion->type === 'fixed') {
            $discount = min((float)$promotion->value, $total);
        } else {
            $discount = round($total * ((float)$promotion->value / 100), 2);
        }

        return [
            'valid' => true,
            'promotion' => $promotion,
            'discount' => $discount,
        ];
    }
}
