<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Promotion;
use App\Models\ShippingAddress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Hiển thị trang xác nhận đặt hàng (checkout)
     */
    public function checkout(Request $request)
    {
        $itemId = $request->query('item_id'); // có thể null

        $cart = Cart::with(['items.product.primaryImage', 'items.variant'])
            ->firstOrCreate(['user_id' => Auth::id()]);

        // Map toàn bộ items trước
        $allItems = $cart->items->map(function ($item) {
            $price = $item->variant
                ? ($item->variant->price ?? $item->product->price)
                : ($item->product->price ?? 0);

            return (object)[
                'id' => $item->id,
                'product_id' => $item->product_id,
                'product' => $item->product ? [
                    'id' => $item->product->id,
                    'name' => $item->product->name ?? null,
                    'image' => $item->product->primaryImage->url ?? null,
                    'brand_id' => $item->product->brand_id ?? null,
                    'seller_id' => $item->product->created_by ?? null,
                ] : null,
                'variant' => $item->variant ? [
                    'id' => $item->variant->id,
                    'name' => $item->variant->variant_name ?? null,
                    'image' => optional($item->variant->image)->url ?? null,
                ] : null,
                'price' => $price,
                'quantity' => $item->quantity,
                'subtotal' => $price * $item->quantity,
            ];
        });

        // Nếu request có item_id và item tồn tại trong cart => chỉ hiển item đó
        if ($itemId) {
            $items = $allItems->filter(fn($it) => (int)$it->id === (int)$itemId)->values();
            // nếu item không tìm thấy, fallback về đầy đủ cart hoặc redirect tùy ý
            if ($items->isEmpty()) {
                // trả về trang cart nếu item không thuộc giỏ
                return redirect()->route('cart.index')->withErrors(['msg' => 'Sản phẩm không có trong giỏ.']);
            }
        } else {
            $items = $allItems;
        }

        $total = $items->sum('subtotal');

        // Load user's shipping addresses
        $addresses = ShippingAddress::where('user_id', Auth::id())->get()->map(function ($a) {
            return [
                'id' => $a->id,
                'recipient_name' => $a->recipient_name,
                'phone' => $a->phone,
                'address_line' => $a->address_line,
                'province_id' => $a->province_id,
                'district_id' => $a->district_id,
                'ward_id' => $a->ward_id,
                'is_default' => (bool) $a->is_default,
            ];
        });

        // Collect ids from selected items (IMPORTANT: dùng $items chứ không phải toàn bộ cart)
        $productIds = $items->pluck('product_id')->filter()->unique()->values()->all();
        $brandIds = $items->pluck('product.brand_id')->filter()->unique()->values()->all();
        $sellerIds = $items->pluck('product.seller_id')->filter()->unique()->values()->all();

        // Promotions logic (giữ nguyên, nhưng áp dụng trên selected items)
        $promotions = Promotion::where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->where(function ($q) use ($sellerIds) {
                $q->whereNull('seller_id')->orWhereIn('seller_id', $sellerIds ?: [0]);
            })
            ->get()
            ->filter(function (Promotion $p) use ($productIds, $brandIds, $total) {
                if ($p->usage_limit !== null && $p->used_count >= $p->usage_limit) {
                    return false;
                }
                if ($p->min_order_amount && $total < $p->min_order_amount) {
                    return false;
                }
                $conds = $p->conditions()->whereIn('condition_type', ['product', 'brand'])->get();
                if ($conds->isEmpty()) {
                    return false;
                }
                foreach ($conds as $c) {
                    if ($c->condition_type === 'product' && in_array($c->target_id, $productIds, true)) {
                        return true;
                    }
                    if ($c->condition_type === 'brand' && in_array($c->target_id, $brandIds, true)) {
                        return true;
                    }
                }
                return false;
            })
            ->values()
            ->map(function (Promotion $p) {
                return [
                    'id' => $p->id,
                    'code' => $p->code,
                    'type' => $p->type,
                    'value' => (float) $p->value,
                    'description' => $p->description,
                    'min_order_amount' => (float) $p->min_order_amount,
                    'seller_id' => $p->seller_id,
                ];
            });

        return Inertia::render('Customer/Checkout', [
            'cart' => [
                'id' => $cart->id,
                'items' => $items,
                'total' => $total,
            ],
            'addresses' => $addresses,
            'promotions' => $promotions,
            'placeOrderUrl' => route('customer.checkout.placeOrder'),
            'cart_item_id' => $itemId ? (int)$itemId : null, // gửi về frontend để form post đúng
        ]);
    }

    /**
     * Thực hiện tạo order (chưa xử lý thanh toán)
     */
    public function placeOrder(Request $request)
    {
        $data = $request->validate([
            'shipping_address_id' => ['nullable', 'integer'],
            'promotion_id' => ['nullable', 'integer'],
            'cart_item_id' => ['nullable', 'integer'], // <-- thêm
        ]);

        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('user_id', Auth::id())
            ->first();

        if (!$cart || $cart->items->isEmpty()) {
            return redirect()->route('customer.cart.index')->withErrors(['msg' => 'Giỏ hàng rỗng.']);
        }

        // nếu có cart_item_id => chỉ lấy item đó
        $selectedItems = $cart->items;
        if (!empty($data['cart_item_id'])) {
            $selectedItems = $cart->items->filter(fn($it) => (int)$it->id === (int)$data['cart_item_id'])->values();
            if ($selectedItems->isEmpty()) {
                return back()->withErrors(['msg' => 'Sản phẩm không có trong giỏ.']);
            }
        }

        // Recompute totals trên selectedItems
        $total = 0;
        foreach ($selectedItems as $item) {
            $price = $item->variant
                ? ($item->variant->price ?? $item->product->price)
                : ($item->product->price ?? 0);
            $total += $price * $item->quantity;
        }

        $appliedPromotion = null;
        $discountAmount = 0;
        if (!empty($data['promotion_id'])) {
            $promotion = Promotion::find($data['promotion_id']);
            if (!$promotion) {
                return back()->withErrors(['promotion_id' => 'Mã khuyến mãi không tồn tại.']);
            }
            // basic validations
            if (!$promotion->is_active
                || ($promotion->starts_at && $promotion->starts_at > now())
                || ($promotion->expires_at && $promotion->expires_at < now())
                || ($promotion->usage_limit !== null && $promotion->used_count >= $promotion->usage_limit)
                || ($promotion->min_order_amount && $total < $promotion->min_order_amount)
            ) {
                return back()->withErrors(['promotion_id' => 'Khuyến mãi không hợp lệ với đơn hàng này.']);
            }

            // Ensure promotion is from admin or from one of product sellers in the cart
            $sellerIds = $cart->items->pluck('product.created_by')->filter()->unique()->values()->all();
            if ($promotion->seller_id !== null && !in_array($promotion->seller_id, $sellerIds, true)) {
                return back()->withErrors(['promotion_id' => 'Khuyến mãi không thuộc seller của sản phẩm trong giỏ.']);
            }

            // Check applicability: only consider 'product' and 'brand' conditions
            $productIds = $cart->items->pluck('product_id')->unique()->values()->all();
            $brandIds = $cart->items->pluck('product.brand_id')->filter()->unique()->values()->all();

            $conds = $promotion->conditions()->whereIn('condition_type', ['product', 'brand'])->get();
            if ($conds->isEmpty()) {
                // promotion must have product/brand conditions to be applicable per requirement
                return back()->withErrors(['promotion_id' => 'Khuyến mãi không áp dụng cho sản phẩm trong giỏ.']);
            }

            $applicable = false;
            foreach ($conds as $c) {
                if ($c->condition_type === 'product' && in_array($c->target_id, $productIds, true)) {
                    $applicable = true; break;
                }
                if ($c->condition_type === 'brand' && in_array($c->target_id, $brandIds, true)) {
                    $applicable = true; break;
                }
            }

            if (!$applicable) {
                return back()->withErrors(['promotion_id' => 'Khuyến mãi không áp dụng cho sản phẩm trong giỏ.']);
            }

            // calculate discount
            if ($promotion->type === 'fixed') {
                $discountAmount = min((float)$promotion->value, $total);
            } else { // percent
                $discountAmount = round($total * ((float)$promotion->value / 100), 2);
            }

            $appliedPromotion = $promotion;
        }

        $shippingAddress = null;
        if (!empty($data['shipping_address_id'])) {
            $shippingAddress = ShippingAddress::where('id', $data['shipping_address_id'])
                ->where('user_id', Auth::id())
                ->first();
            if (!$shippingAddress) {
                return back()->withErrors(['shipping_address_id' => 'Địa chỉ giao hàng không tồn tại']);
            }
        }

        DB::transaction(function () use ($cart, $shippingAddress, $appliedPromotion, $discountAmount, &$total, $selectedItems, $data) {
            $finalTotal = max(0, $total - $discountAmount);

            $orderData = [
                'user_id' => Auth::id(),
                'status' => 'placed',
                'total_amount' => $finalTotal,
                'placed_at' => now(),
            ];

            if (Schema::hasColumn('orders', 'shipping_address_id') && !empty($shippingAddress)) {
                $orderData['shipping_address_id'] = $shippingAddress->id;
            }
            if (Schema::hasColumn('orders', 'promotion_id') && !empty($appliedPromotion)) {
                $orderData['promotion_id'] = $appliedPromotion->id;
            }

            $order = Order::create($orderData);

            foreach ($selectedItems as $item) {
                $price = $item->variant
                    ? ($item->variant->price ?? $item->product->price)
                    : ($item->product->price ?? 0);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $item->quantity,
                    'price' => $price,
                ]);

                if ($item->variant) {
                    $item->variant->decrement('stock', $item->quantity);
                } elseif ($item->product) {
                    $item->product->decrement('stock', $item->quantity);
                }

                // xóa từng CartItem đã mua (không xóa toàn giỏ)
                $cartItemModel = Cart::find($cart->id)->items()->where('id', $item->id)->first();
                if ($cartItemModel) {
                    $cartItemModel->delete();
                }
            }

            // increment promotion usage and pivot as before
            if (!empty($appliedPromotion)) {
                $appliedPromotion->increment('used_count');
                if (Schema::hasTable('promotion_usages')) {
                    DB::table('promotion_usages')->updateOrInsert(
                        ['promotion_id' => $appliedPromotion->id, 'user_id' => Auth::id()],
                        ['used_times' => DB::raw('COALESCE(used_times,0) + 1')]
                    );
                }
            }

            $total = $finalTotal;
        });

        return redirect()->route('customer.orders.index')->with('success', 'Đặt hàng thành công. Tổng thanh toán: ' . number_format($total, 2));
    }
}
