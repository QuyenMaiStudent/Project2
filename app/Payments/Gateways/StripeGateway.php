<?php

namespace App\Payments\Gateways;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Transaction;
use App\Models\Package;
use App\Models\PackagePayment;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use RuntimeException;
use Stripe\StripeClient;

class StripeGateway implements PaymentGateway
{
    public function __construct(private StripeClient $stripe) {}

    private function fetchVndToUsdRate(): float
    {
        return Cache::remember('rate.vnd_usd', 600, function () {
            $res = Http::get('https://api.exchangerate.host/latest', [
                'base' => 'VND',
                'symbols' => 'USD',
            ]);

            $rate = data_get($res->json(), 'rates.USD');

            // fallback nếu API hỏng (chỉnh theo thực tế)
            return $rate ? (float)$rate : 0.000042;
        });
    }

    /**
     * Map payment status để đảm bảo tương thích với enum
     */
    private function mapPaymentStatus(string $status): string
    {
        return match(strtolower($status)) {
            'success', 'completed', 'paid', 'succeeded' => 'succeeded',
            'pending', 'processing', 'waiting' => 'pending',
            'failed', 'error', 'declined' => 'failed',
            'canceled', 'cancelled', 'voided' => 'canceled',
            'refunded', 'refund' => 'refunded',
            default => 'pending'
        };
    }

    public function createPayment(Order $order): string
    {
        $rate = $this->fetchVndToUsdRate();

        $currency = strtolower(config('services.stripe.currency', 'usd'));

        $lineItems = $order->items->map(function ($item) use ($rate, $currency) {
            // Nếu cấu hình là VND -> gửi trực tiếp amount bằng VND (Stripe expects smallest currency unit)
            if ($currency === 'vnd') {
                // item->price đang là VND, unit_amount là số nguyên VND
                $unitAmount = max(1, (int) round((float) $item->price));
            } else {
                // Chuyển VND -> USD và dùng cents cho currencies như 'usd'
                $unitUsd = round((float)$item->price * $rate, 2);
                $unitAmount = max(50, (int) round($unitUsd * 100)); // tối thiểu 50 cents
            }

            return [
                'price_data' => [
                    'currency'     => $currency,
                    'product_data' => ['name' => $item->product->name],
                    'unit_amount'  => $unitAmount,
                ],
                'quantity' => (int) $item->quantity,
            ];
        })->values()->toArray();

        $session = $this->stripe->checkout->sessions->create([
            'mode'                 => 'payment',
            'success_url'          => route('payments.return', ['provider' => 'stripe']) . '?status=success&order_id=' . $order->id . '&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url'           => route('payments.return', ['provider' => 'stripe']) . '?status=cancel&order_id=' . $order->id,
            'payment_method_types' => ['card'],
            'line_items'           => $lineItems,
            'metadata'             => [
                'order_id' => (string) $order->id,
                'rate'     => (string) $rate,
                'currency' => $currency,
            ],
            'automatic_tax' => ['enabled' => false],
            'billing_address_collection' => 'auto',
            'locale' => 'vi',
        ]);

        Log::info('Stripe session created', [
            'session_id' => $session->id,
            'order_id' => $order->id,
            'url' => $session->url,
            'currency' => $currency,
            'line_items' => $lineItems,
        ]);

        return $session->url;
    }

    /**
     * Create Stripe Checkout session for a Package
     */
    public function createPackagePayment(Package $package, PackagePayment $payment): string
    {
        $rate = $this->fetchVndToUsdRate();
        $currency = strtolower(config('services.stripe.currency', 'usd'));

        if ($currency === 'vnd') {
            $unitAmount = max(1, (int) round((float)$package->price));
        } else {
            $unitUsd = round((float)$package->price * $rate, 2);
            $unitAmount = max(50, (int) round($unitUsd * 100));
        }

        $lineItems = [
            [
                'price_data' => [
                    'currency'     => $currency,
                    'product_data' => ['name' => $package->name],
                    'unit_amount'  => $unitAmount,
                ],
                'quantity' => 1,
            ],
        ];

        $successUrl = $payment->return_url . (str_contains($payment->return_url, '?') ? '&' : '?') . http_build_query([
            'status' => 'success',
            'session_id' => '{CHECKOUT_SESSION_ID}',
        ]);

        $cancelUrl = $payment->return_url . (str_contains($payment->return_url, '?') ? '&' : '?') . http_build_query([
            'status' => 'cancel',
        ]);

        $session = $this->stripe->checkout->sessions->create([
            'mode'       => 'payment',
            'success_url' => $successUrl,
            'cancel_url'  => $cancelUrl,
            'payment_method_types' => ['card'],
            'line_items' => $lineItems,
            'metadata' => [
                'package_id' => (string) $package->id,
                'user_id' => (string) ($payment->user_id ?? ''),
                'rate' => (string) $rate,
                'package_payment_id' => (string) $payment->id,
            ],
            'automatic_tax' => ['enabled' => false],
            'billing_address_collection' => 'auto',
            'locale' => 'vi',
        ]);

        $payment->update([
            'reference' => $session->id,
            'external_id' => $session->id,
            'metadata' => array_merge($payment->metadata ?? [], [
                'session_id' => $session->id,
            ]),
        ]);

        Log::info('Stripe package session created', ['session_id' => $session->id, 'package_id' => $package->id, 'url' => $session->url]);

        return $session->url;
    }

    public function handleReturn(array $payload): array
    {
        $status = $payload['status'] ?? 'cancel';

        if (isset($payload['package_payment'])) {
            $normalizedStatus = $status === 'success'
                ? 'succeeded'
                : ($status === 'cancel' ? 'canceled' : 'failed');

            return [
                'status' => $normalizedStatus,
                'transaction_id' => $payload['session_id'] ?? null,
                'message' => $normalizedStatus === 'succeeded' ? 'Checkout completed' : null,
                'package_payment_id' => (int) $payload['package_payment'],
            ];
        }

        if ($status === 'success') {
            $sessionId = $payload['session_id'] ?? null;
            $orderId = $payload['order_id'] ?? null;
            
            // Fallback: Nếu webhook chưa xử lý, xử lý ở đây
            if ($sessionId && $orderId) {
                try {
                    $session = $this->stripe->checkout->sessions->retrieve($sessionId);
                    if ($session->payment_status === 'paid') {
                        // Gọi logic completion tương tự webhook
                        $this->completePayment($orderId, $session->payment_intent, 'return_' . $sessionId);
                    }
                } catch (\Throwable $e) {
                    Log::warning('Failed to process return fallback', ['error' => $e->getMessage()]);
                }
            }
            
            return ['status' => 'succeeded', 'transaction_id' => $sessionId, 'message' => 'Checkout completed'];
        }
        
        if ($status === 'cancel') return ['status' => 'canceled', 'transaction_id' => null, 'message' => 'User canceled'];
        return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Unknown status'];
    }

    public function completePayment(?string $orderId, ?string $pi, string $eventId): void
    {
        if (!$orderId) {
            Log::warning('No order ID found', ['event_id' => $eventId]);
            return;
        }
        
        DB::transaction(function () use ($orderId, $pi, $eventId) {
            $order = Order::with(['items', 'user'])->lockForUpdate()->findOrFail($orderId);
            
            if ($order->status === 'paid') {
                Log::info('Order already paid', ['order_id' => $order->id, 'event_id' => $eventId]);
                return;
            }
            
            // Trừ stock cho từng item
            foreach ($order->items as $item) {
                $qty = (int) $item->quantity;
                
                if ($item->product_variant_id) {
                    $affected = ProductVariant::where('id', $item->product_variant_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);
                    
                    if ($affected === 0) {
                        throw new RuntimeException("Không đủ tồn kho cho variant ID {$item->product_variant_id}");
                    }
                } else {
                    $affected = DB::table('products')
                        ->where('id', $item->product_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);
                    
                    if ($affected === 0) {
                        throw new RuntimeException("Không đủ tồn kho cho sản phẩm ID {$item->product_id}");
                    }
                }
            }
            
            // XÓA ITEMS KHỎI GIỎ HÀNG
            $cart = Cart::where('user_id', $order->user_id)->first();
            if ($cart) {
                foreach ($order->items as $orderItem) {
                    $cart->items()
                        ->where('product_id', $orderItem->product_id)
                        ->where('product_variant_id', $orderItem->product_variant_id)
                        ->delete();
                }
            }
            
            // Cập nhật payment và tạo transaction với status mapping
            $payment = Payment::where('order_id', $order->id)
                ->whereRaw('LOWER(provider) = ?', ['stripe'])
                ->first();

            if ($payment) {
                $mappedStatus = $this->mapPaymentStatus('succeeded');
                
                $payment->update([
                    'status' => $mappedStatus,
                    'transaction_id' => $pi,
                    'gateway_event_id' => $eventId,
                    'paid_at' => now(),
                ]);

                Transaction::create([
                    'payment_id' => $payment->id,
                    'gateway' => 'stripe',
                    'transaction_code' => $pi,
                    'status' => $mappedStatus, // Sử dụng mapped status
                    'amount' => $order->total_amount,
                    'processed_at' => now(),
                ]);
            }
            
            // Cập nhật order
            $order->update(['status' => 'paid']);
            
            // Xử lý promotion
            if (!empty($order->promotion_id)) {
                try {
                    Promotion::where('id', $order->promotion_id)->increment('used_count');

                    $exists = DB::table('promotion_usages')
                        ->where('promotion_id', $order->promotion_id)
                        ->where('user_id', $order->user_id)
                        ->exists();

                    if ($exists) {
                        DB::table('promotion_usages')
                            ->where('promotion_id', $order->promotion_id)
                            ->where('user_id', $order->user_id)
                            ->increment('used_times', 1);
                    } else {
                        DB::table('promotion_usages')->insert([
                            'promotion_id' => $order->promotion_id,
                            'user_id' => $order->user_id,
                            'used_times' => 1,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                } catch (\Throwable $ex) {
                    Log::warning('Failed to update promotion usage', ['error' => $ex->getMessage()]);
                }
            }
            
            Log::info('Payment completed', ['order_id' => $order->id, 'event_id' => $eventId]);
        });
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        $type = $payload['type'] ?? '';
        if ($type !== 'checkout.session.completed') {
            return ['status' => 'ignored', 'transaction_id' => null, 'message' => 'Unhandled'];
        }

        $session = $payload['data']['object'] ?? [];
        $sessionId = $session['id'] ?? null;
        $orderId   = $session['metadata']['order_id'] ?? null;
        $pi        = $session['payment_intent'] ?? null;
        $eventId   = $payload['id'] ?? null;
        $packagePaymentId = $session['metadata']['package_payment_id'] ?? null;

        if ($packagePaymentId) {
            return [
                'status' => 'succeeded',
                'transaction_id' => $pi ?? $sessionId,
                'message' => 'Package payment completed via webhook',
                'package_payment_id' => (int) $packagePaymentId,
            ];
        }

        if (!$sessionId || !$orderId) {
            return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Missing session/order metadata'];
        }

        $this->completePayment($orderId, $pi, $eventId);

        return ['status' => 'succeeded', 'transaction_id' => $pi, 'message' => 'Stock decremented & order paid'];
    }
}