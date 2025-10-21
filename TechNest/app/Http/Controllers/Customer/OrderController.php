<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PaymentMethod;
use App\Models\Promotion;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Hiển thị trang xác nhận đặt hàng (checkout)
     */
    public function checkout(Request $request)
    {
        $itemId = $request->query('item_id');

        $cart = Cart::with([
            'items.product.primaryImage',
            'items.product.categories',
            'items.product.brand',
            'items.variant.image'
        ])->firstOrCreate(['user_id' => Auth::id()]);

        // Map toàn bộ items với đầy đủ thông tin
        $allItems = $cart->items->map(function ($item) {
            // Xác định giá chính xác cho variant
            $price = $this->calculateItemPrice($item);

            return (object)[
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product' => $item->product ? [
                    'id' => $item->product->id,
                    'name' => $item->product->name ?? null,
                    'image' => $item->product->primaryImage->url ?? null,
                    'brand_id' => $item->product->brand_id ?? null,
                    'seller_id' => $item->product->created_by ?? null,
                    'category_ids' => $item->product->categories->pluck('id')->toArray(),
                ] : null,
                'variant' => $item->variant ? [
                    'id' => $item->variant->id,
                    'name' => $item->variant->variant_name ?? null,
                    'image' => optional($item->variant->image)->url ?? null,
                    'price' => $item->variant->price ?? null,
                    'additional_price' => $item->variant->additional_price ?? null,
                ] : null,
                'price' => $price,
                'quantity' => $item->quantity,
                'subtotal' => $price * $item->quantity,
            ];
        });

        // Filter items nếu có item_id
        if ($itemId) {
            $items = $allItems->filter(fn($it) => (int)$it->id === (int)$itemId)->values();
            if ($items->isEmpty()) {
                return redirect()->route('cart.index')->withErrors(['msg' => 'Sản phẩm không có trong giỏ.']);
            }
        } else {
            $items = $allItems;
        }

        $total = $items->sum('subtotal');

        // Load shipping addresses với đầy đủ thông tin
        $addresses = ShippingAddress::where('user_id', Auth::id())
            ->with(['province', 'district', 'ward'])
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'recipient_name' => $a->recipient_name,
                    'phone' => $a->phone,
                    'address_line' => $a->address_line,
                    'province_id' => $a->province_id,
                    'district_id' => $a->district_id,
                    'ward_id' => $a->ward_id,
                    'is_default' => (bool) $a->is_default,
                    'full_address' => $this->formatFullAddress($a),
                ];
            });

        // Load payment methods
        $paymentMethods = PaymentMethod::where('is_active', true)
            ->get()
            ->map(function ($pm) {
                return [
                    'id' => $pm->id,
                    'name' => $pm->name,
                    'provider' => $pm->provider,
                ];
            });

        // Collect IDs cho promotion filtering
        $productIds = $items->map(fn($it) => data_get($it, 'product.id'))
            ->filter()
            ->unique()
            ->values()
            ->all();

        $brandIds = $items->map(fn($it) => data_get($it, 'product.brand_id'))
            ->filter()
            ->unique()
            ->values()
            ->all();

        $categoryIds = $items->flatMap(fn($it) => data_get($it, 'product.category_ids', []))
            ->unique()
            ->values()
            ->all();

        $sellerIds = $items->map(function ($it) {
            return data_get($it, 'product.seller_id');
        })->filter()->unique()->values()->all();

        Log::info('Checkout - collected IDs', [
            'products' => $productIds,
            'brands' => $brandIds,
            'categories' => $categoryIds,
            'sellers' => $sellerIds,
        ]);

        // Query promotions
        $promotionsQuery = Promotion::with('conditions')
            ->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')
                  ->orWhereRaw('used_count < usage_limit');
            });

        // Filter by seller (admin + specific sellers)
        if (!empty($sellerIds)) {
            $promotionsQuery->where(function ($q) use ($sellerIds) {
                $q->whereNull('seller_id')->orWhereIn('seller_id', $sellerIds);
            });
        } else {
            $promotionsQuery->whereNull('seller_id');
        }

        $allPromotions = $promotionsQuery->get();

        // Filter applicable promotions (product/brand/category)
        $applicable = $allPromotions->filter(function (Promotion $p) use ($productIds, $brandIds, $categoryIds) {
            $conds = $p->conditions ?? collect();
            
            // Global promotion (no conditions)
            if ($conds->isEmpty()) {
                return true;
            }

            // Check conditions
            foreach ($conds as $c) {
                if ($c->condition_type === 'product' && in_array((int)$c->target_id, $productIds, true)) {
                    return true;
                }
                if ($c->condition_type === 'brand' && in_array((int)$c->target_id, $brandIds, true)) {
                    return true;
                }
                if ($c->condition_type === 'category' && in_array((int)$c->target_id, $categoryIds, true)) {
                    return true;
                }
            }

            return false;
        })->values();

        Log::info('Promotions filtered', [
            'total_fetched' => $allPromotions->count(),
            'applicable' => $applicable->count(),
        ]);

        // Format promotions for frontend
        $promotions = $applicable->map(function (Promotion $p) {
            return [
                'id' => $p->id,
                'code' => $p->code,
                'type' => $p->type,
                'value' => (float) $p->value,
                'description' => $p->description,
                'min_order_amount' => (float) ($p->min_order_amount ?? 0),
                'seller_id' => $p->seller_id ?? null,
            ];
        })->values();

        return Inertia::render('Customer/Checkout', [
            'cart' => [
                'id' => $cart->id,
                'items' => $items,
                'total' => $total,
            ],
            'addresses' => $addresses,
            'paymentMethods' => $paymentMethods,
            'promotions' => $promotions,
            'placeOrderUrl' => route('customer.checkout.placeOrder'),
            'cart_item_id' => $itemId ? (int)$itemId : null,
        ]);
    }

    /**
     * Thực hiện tạo order
     */
    public function placeOrder(Request $request)
    {
        $data = $request->validate([
            'shipping_address_id' => ['required', 'integer', 'exists:shipping_addresses,id'],
            'payment_method_id' => ['required', 'integer', 'exists:payment_methods,id'],
            'promotion_id' => ['nullable', 'integer', 'exists:promotions,id'],
            'cart_item_id' => ['nullable', 'integer'],
        ]);

        // Validate shipping address belongs to user
        $shippingAddress = ShippingAddress::where('id', $data['shipping_address_id'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$shippingAddress) {
            return back()->withErrors(['shipping_address_id' => 'Địa chỉ giao hàng không hợp lệ.']);
        }

        // Validate payment method is active
        $paymentMethod = PaymentMethod::where('id', $data['payment_method_id'])
            ->where('is_active', true)
            ->first();

        if (!$paymentMethod) {
            return back()->withErrors(['payment_method_id' => 'Phương thức thanh toán không khả dụng.']);
        }

        $cart = Cart::with([
            'items.product.categories',
            'items.product.brand',
            'items.variant'
        ])->where('user_id', Auth::id())->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('customer.cart.index')->withErrors(['msg' => 'Giỏ hàng rỗng.']);
        }

        // Filter selected items
        $selectedItems = $cart->items;
        if (!empty($data['cart_item_id'])) {
            $selectedItems = $cart->items->filter(fn($it) => (int)$it->id === (int)$data['cart_item_id'])->values();
            if ($selectedItems->isEmpty()) {
                return back()->withErrors(['msg' => 'Sản phẩm không có trong giỏ.']);
            }
        }

        // Calculate total
        $total = 0;
        foreach ($selectedItems as $item) {
            $price = $this->calculateItemPrice($item);
            $total += $price * $item->quantity;
        }

        // Validate and apply promotion
        $appliedPromotion = null;
        $discountAmount = 0;

        if (!empty($data['promotion_id'])) {
            $result = $this->validateAndCalculatePromotion(
                $data['promotion_id'],
                $selectedItems,
                $total
            );

            if (!$result['valid']) {
                return back()->withErrors(['promotion_id' => $result['error']]);
            }

            $appliedPromotion = $result['promotion'];
            $discountAmount = $result['discount'];
        }

        // Create order in transaction
        DB::transaction(function () use (
            $cart,
            $shippingAddress,
            $paymentMethod,
            $appliedPromotion,
            $discountAmount,
            &$total,
            $selectedItems
        ) {
            $finalTotal = max(0, $total - $discountAmount);

            // Create order
            $orderData = [
                'user_id' => Auth::id(),
                'status' => 'placed',
                'total_amount' => $finalTotal,
                'placed_at' => now(),
                'shipping_address_id' => $shippingAddress->id,
            ];

            if (!empty($appliedPromotion)) {
                $orderData['promotion_id'] = $appliedPromotion->id;
            }

            $order = Order::create($orderData);

            // Create order items
            foreach ($selectedItems as $item) {
                $price = $this->calculateItemPrice($item);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                ]);

                // Update stock
                if ($item->variant) {
                    $item->variant->decrement('stock', $item->quantity);
                } elseif ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                }

                // Remove from cart
                $item->delete();
            }

            // Create payment record
            DB::table('payments')->insert([
                'order_id' => $order->id,
                'payment_method_id' => $paymentMethod->id,
                'amount' => $finalTotal,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Update promotion usage
            if (!empty($appliedPromotion)) {
                $appliedPromotion->increment('used_count');
                
                DB::table('promotion_usages')->updateOrInsert(
                    [
                        'promotion_id' => $appliedPromotion->id,
                        'user_id' => Auth::id()
                    ],
                    [
                        'used_times' => DB::raw('COALESCE(used_times, 0) + 1'),
                        'updated_at' => now(),
                    ]
                );
            }

            $total = $finalTotal;
        });

        return redirect()->route('customer.orders.index')
            ->with('success', 'Đặt hàng thành công! Tổng thanh toán: ' . number_format($total, 0, ',', '.') . '₫');
    }

    /**
     * Calculate price for cart item (considering variant)
     */
    private function calculateItemPrice($item): float
    {
        if ($item->variant) {
            // Nếu variant có trường price riêng, dùng nó
            if ($item->variant->price !== null) {
                return (float) $item->variant->price;
            }
            // Nếu không, cộng additional_price vào giá gốc
            return (float) ($item->product->price ?? 0) + (float) ($item->variant->additional_price ?? 0);
        }
        
        return (float) ($item->product->price ?? 0);
    }

    /**
     * Format full address string
     */
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

    /**
     * Validate promotion and calculate discount
     */
    private function validateAndCalculatePromotion($promotionId, $selectedItems, $total): array
    {
        $promotion = Promotion::with('conditions')->find($promotionId);

        if (!$promotion) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi không tồn tại.'];
        }

        // Check active status
        if (!$promotion->is_active) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi không còn hiệu lực.'];
        }

        // Check time validity
        if ($promotion->starts_at && $promotion->starts_at > now()) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi chưa có hiệu lực.'];
        }

        if ($promotion->expires_at && $promotion->expires_at < now()) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi đã hết hạn.'];
        }

        // Check usage limit
        if ($promotion->usage_limit !== null && $promotion->used_count >= $promotion->usage_limit) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi đã hết lượt sử dụng.'];
        }

        // Check minimum order amount
        if ($promotion->min_order_amount && $total < $promotion->min_order_amount) {
            return ['valid' => false, 'error' => 'Đơn hàng chưa đủ giá trị tối thiểu để áp dụng mã.'];
        }

        // Check seller compatibility
        $sellerIds = $selectedItems->pluck('product.created_by')->filter()->unique()->values()->all();
        if ($promotion->seller_id !== null && !in_array($promotion->seller_id, $sellerIds, true)) {
            return ['valid' => false, 'error' => 'Mã khuyến mãi không áp dụng cho sản phẩm trong giỏ.'];
        }

        // Check applicability (product/brand/category)
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

        // Calculate discount
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
