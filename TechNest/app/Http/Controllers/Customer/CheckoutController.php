<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Promotion;
use App\Models\PaymentMethod;
use App\Models\SellerStore;
use App\Models\ShippingAddress;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index(Request $request)
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
            ->with(['province', 'ward'])
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'recipient_name' => $a->recipient_name,
                    'phone' => $a->phone,
                    'address_line' => $a->address_line,
                    'province_code' => $a->province_code,
                    'province_name' => optional($a->province)->name,
                    'ward_code' => $a->ward_code,
                    'ward_name' => optional($a->ward)->name,
                    'is_default' => (bool) $a->is_default,
                    'latitude' => $a->latitude,
                    'longitude' => $a->longitude,
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

        // Địa chỉ
        $addressesCollection = ShippingAddress::where('user_id', Auth::id())
            ->with(['province', 'ward'])
            ->get();

        $addresses = $addressesCollection->map(function ($a) {
            return [
                'id' => $a->id,
                'recipient_name' => $a->recipient_name,
                'phone' => $a->phone,
                'address_line' => $a->address_line,
                'province_code' => $a->province_code,
                'province_name' => optional($a->province)->name,
                'ward_code' => $a->ward_code,
                'ward_name' => optional($a->ward)->name,
                'is_default' => (bool) $a->is_default,
                'latitude' => $a->latitude,
                'longitude' => $a->longitude,
                'full_address' => $this->formatFullAddress($a),
            ];
        });

        // --- replaced: ensure we collect seller IDs from product.created_by and cast to int ---
        $sellerIds = $items->map(fn($it) => data_get($it, 'product.seller_id'))
            ->filter() // remove null/empty
            ->map(fn($id) => (int) $id) // cast to int to avoid type mismatch
            ->unique()
            ->values()
            ->all();

        // Check Packages
        $hasActivePackage = (bool) optional(Auth::user())->hasActivePackageSubscription();
        $shippingFees = $this->calculateShippingFees($addressesCollection, $sellerIds, $hasActivePackage);

        Log::info('Checkout shipping fees', [
            'has_active_package' => $hasActivePackage,
            'shipping_fees' => $shippingFees,
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

        // Filter by seller (include global promotions + promotions created by those sellers)
        if (!empty($sellerIds)) {
            $promotionsQuery->where(function ($q) use ($sellerIds) {
                $q->whereNull('seller_id')
                  ->orWhereIn('seller_id', $sellerIds);
            });
        } else {
            // no seller in cart -> only global promotions
            $promotionsQuery->whereNull('seller_id');
        }

        Log::debug('Promotions query - sellers', ['seller_ids' => $sellerIds]);

        $allPromotions = $promotionsQuery->get();

        // Filter applicable promotions (product/brand/category)
        $applicable = $allPromotions->filter(function (Promotion $p) use ($productIds, $brandIds, $categoryIds) {
            $conds = $p->conditions ?? collect();
            
            // Global promotion (no conditions) - áp dụng cho tất cả
            if ($conds->isEmpty()) {
                Log::debug("Promotion {$p->id} ({$p->code}) - Global, no conditions");
                return true;
            }

            // Check conditions - chỉ cần 1 điều kiện match là OK
            foreach ($conds as $c) {
                if ($c->condition_type === 'product' && in_array((int)$c->target_id, $productIds, true)) {
                    Log::debug("Promotion {$p->id} ({$p->code}) - Matched product {$c->target_id}");
                    return true;
                }
                if ($c->condition_type === 'brand' && in_array((int)$c->target_id, $brandIds, true)) {
                    Log::debug("Promotion {$p->id} ({$p->code}) - Matched brand {$c->target_id}");
                    return true;
                }
                if ($c->condition_type === 'category' && in_array((int)$c->target_id, $categoryIds, true)) {
                    Log::debug("Promotion {$p->id} ({$p->code}) - Matched category {$c->target_id}");
                    return true;
                }
            }

            Log::debug("Promotion {$p->id} ({$p->code}) - No match found", [
                'conditions' => $conds->map(fn($c) => [
                    'type' => $c->condition_type,
                    'target_id' => $c->target_id
                ])->toArray()
            ]);
            return false;
        })->values();

        Log::info('Promotions filtered', [
            'total_fetched' => $allPromotions->count(),
            'applicable' => $applicable->count(),
            'applicable_ids' => $applicable->pluck('id')->toArray(),
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
            'shippingFees' => $shippingFees,
            'hasFreeShipping' => $hasActivePackage,
            'shippingRatePerKm' => config('services.shipping.rate_per_km', 100),
        ]);
    }

    /**
     * Calculate price for cart item (considering variant)
     */
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

    /**
     * Format full address string
     */
    private function formatFullAddress($address): string
    {
        $parts = [
            $address->address_line,
            optional($address->ward)->name,
            optional($address->province)->name,
        ];

        return implode(', ', array_filter($parts));
    }

    private function calculateShippingFees(Collection $addresses, array $sellerIds, bool $hasPackage): array
    {
        if ($addresses->isEmpty()) {
            return [];
        }

        if ($hasPackage) {
            return $addresses
                ->mapWithKeys(fn (ShippingAddress $address) => [$address->id => 0])
                ->toArray();
        }

        if (empty($sellerIds)) {
            return $addresses
                ->mapWithKeys(fn (ShippingAddress $address) => [$address->id => 0])
                ->toArray();
        }

        $stores = SellerStore::whereIn('seller_id', $sellerIds)
            ->whereNotNull('latitude')
            ->whereNotNull('longitude')
            ->get()
            ->keyBy('seller_id');

        $ratePerKm = (float) config('services.shipping.rate_per_km', 100);

        return $addresses->mapWithKeys(function (ShippingAddress $address) use ($stores, $sellerIds, $ratePerKm) {
            if ($address->latitude === null || $address->longitude === null) {
                return [$address->id => null];
            }

            $totalFee = 0.0;

            foreach ($sellerIds as $sellerId) {
                $store = $stores->get($sellerId);

                if (! $store || $store->latitude === null || $store->longitude === null) {
                    continue;
                }

                $distanceKm = $this->calculateDistanceKm(
                    (float) $store->latitude,
                    (float) $store->longitude,
                    (float) $address->latitude,
                    (float) $address->longitude
                );

                $totalFee += $distanceKm * $ratePerKm;
            }

            return [$address->id => round($totalFee)];
        })->toArray();
    }

    private function calculateDistanceKm(float $latFrom, float $lonFrom, float $latTo, float $lonTo): float
    {
        $earthRadiusKm = 6371;

        $latFromRad = deg2rad($latFrom);
        $lonFromRad = deg2rad($lonFrom);
        $latToRad = deg2rad($latTo);
        $lonToRad = deg2rad($lonTo);

        $latDelta = $latToRad - $latFromRad;
        $lonDelta = $lonToRad - $lonFromRad;

        $a = sin($latDelta / 2) ** 2 +
            cos($latFromRad) * cos($latToRad) * sin($lonDelta / 2) ** 2;

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadiusKm * $c;
    }

    public function placeOrder(Request $request)
    {
        $validated = $request->validate([
            'shipping_address_id' => 'required|exists:shipping_addresses,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'promotion_id' => 'nullable|exists:promotions,id',
            'cart_item_id' => 'nullable|integer',
            'shipping_fee' => 'required|numeric|min:0',
            'discount_amount' => 'required|numeric|min:0',
            'final_total' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
        ]);

        $cart = Cart::with(['items.product', 'items.variant'])
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $items = $validated['cart_item_id']
            ? $cart->items->where('id', $validated['cart_item_id'])
            : $cart->items;

        if ($items->isEmpty()) {
            return back()->withErrors(['msg' => 'Giỏ hàng trống.']);
        }

        $paymentMethod = PaymentMethod::findOrFail($validated['payment_method_id']);

        $paymentPayload = [
            'gateway' => $paymentMethod->provider,
            'user_id' => Auth::id(),
            'shipping_address_id' => $validated['shipping_address_id'], // FIX: Thêm dòng này
            'subtotal' => $validated['subtotal'],
            'discount_amount' => $validated['discount_amount'],
            'shipping_fee' => $validated['shipping_fee'],
            'promotion_id' => $validated['promotion_id'] ?? null,
            'currency' => 'VND',
            'items' => $items->map(fn($item) => [
                'product_id' => $item->product_id,
                'product_variant_id' => $item->product_variant_id,
                'quantity' => $item->quantity,
                'price' => $this->calculateItemPrice($item),
            ])->toArray(),
        ];

        Log::info('Place order request', [
            'user_id' => Auth::id(),
            'validated' => $validated,
            'payment_method' => $paymentMethod->provider,
        ]);

        try {
            $result = app(PaymentService::class)->createPayment($paymentPayload);

            Log::info('Payment created', [
                'result' => $result,
                'gateway' => $paymentMethod->provider,
            ]);

            if (!empty($result['redirect_url'])) {
                return Inertia::location($result['redirect_url']);
            }

            return back()->withErrors(['msg' => 'Không thể tạo thanh toán.']);

        } catch (\Throwable $e) {
            Log::error('Payment creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'gateway' => $paymentMethod->provider,
            ]);

            return back()->withErrors(['msg' => 'Có lỗi xảy ra khi tạo thanh toán.']);
        }
    }
}
