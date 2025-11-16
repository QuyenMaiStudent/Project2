<?php

namespace App\Payments\Gateways;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Transaction;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use App\Models\Package;
use App\Models\PackagePayment;
use Illuminate\Support\Str;

class PaypalGateway implements PaymentGateway
{
    private string $base;
    private string $clientId;
    private string $clientSecret;
    
    public function __construct()
    {
        $mode = config('services.paypal.mode', 'sandbox');
        $this->base = $mode === 'live'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        $this->clientId     = (string) config('services.paypal.client_id');
        $this->clientSecret = (string) config('services.paypal.client_secret');
    }

    public function createPayment(Order $order): string
    {
        // FIX 1: Chuyển đổi VND sang USD (PayPal không hỗ trợ VND)
        $vndAmount = (float) $order->total_amount;
        $usdAmount = $this->convertVndToUsd($vndAmount);
        
        $token = $this->getAccessToken();

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => (string) $order->id,
                'amount' => [
                    'currency_code' => 'USD',
                    'value' => $usdAmount,
                    'breakdown' => [
                        'item_total' => [
                            'currency_code' => 'USD',
                            'value' => $usdAmount,
                        ]
                    ]
                ],
                'description' => "Order #{$order->id} from TechNest",
                'items' => $this->buildItemsArray($order),
            ]],
            'application_context' => [
                'brand_name'  => config('app.name', 'TechNest'),
                'landing_page' => 'NO_PREFERENCE',
                'user_action' => 'PAY_NOW',
                'return_url'  => route('payments.return', ['provider' => 'paypal']) . '?order_id=' . $order->id,
                'cancel_url'  => route('payments.return', ['provider' => 'paypal']) . '?status=cancel&order_id=' . $order->id,
            ],
        ];

        Log::info('PayPal create payment request', [
            'order_id' => $order->id,
            'vnd_amount' => $vndAmount,
            'usd_amount' => $usdAmount,
            'payload' => $payload
        ]);

        $res = Http::withToken($token)
            ->acceptJson()
            ->asJson()
            ->post($this->base . '/v2/checkout/orders', $payload);

        if (!$res->successful()) {
            Log::error('PayPal create order failed', [
                'status' => $res->status(),
                'body' => $res->body(),
                'order_id' => $order->id
            ]);
            throw new RuntimeException('PayPal create order failed: ' . $res->body());
        }

        $data = $res->json();
        $approve = collect($data['links'] ?? [])->first(fn($l) => ($l['rel'] ?? '') === 'approve');

        if (!$approve || empty($approve['href'])) {
            Log::error('PayPal approve URL not found', ['response' => $data]);
            throw new RuntimeException('PayPal approve URL not found.');
        }

        // FIX 2: Tạo Payment record với thông tin đúng
        Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'provider' => 'paypal',
                'status' => 'pending',
                'amount' => $order->total_amount, // Lưu amount gốc (VND)
                'currency' => 'VND', // Currency gốc
                'transaction_id' => $data['id'] ?? null,
                'gateway_event_id' => $data['id'] ?? null,
            ]
        );

        Log::info('PayPal payment created successfully', [
            'order_id' => $order->id,
            'paypal_order_id' => $data['id'] ?? null,
            'approve_url' => $approve['href']
        ]);

        return $approve['href'];
    }

    /**
     * Create PayPal order for a Package.
     */
    public function createPackagePayment(Package $package, PackagePayment $payment): string
    {
        $vndAmount = (float) $package->price;
        $usdAmount = $this->convertVndToUsd($vndAmount);

        $token = $this->getAccessToken();
        $reference = 'pkg_' . $payment->id;

        $returnUrl = $payment->return_url . (str_contains($payment->return_url, '?') ? '&' : '?') . http_build_query([
            'status' => 'success',
            'package_payment' => $payment->id,
        ]);

        $cancelUrl = $payment->return_url . (str_contains($payment->return_url, '?') ? '&' : '?') . http_build_query([
            'status' => 'cancel',
            'package_payment' => $payment->id,
        ]);

        $payload = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'reference_id' => $reference,
                'amount' => [
                    'currency_code' => 'USD',
                    'value' => $usdAmount,
                    'breakdown' => [
                        'item_total' => [
                            'currency_code' => 'USD',
                            'value' => $usdAmount,
                        ]
                    ]
                ],
                'description' => "Package #{$package->id} from TechNest",
                'items' => [[
                    'name' => $package->name,
                    'unit_amount' => ['currency_code' => 'USD', 'value' => $usdAmount],
                    'quantity' => '1',
                ]],
            ]],
            'application_context' => [
                'brand_name'  => config('app.name', 'TechNest'),
                'landing_page' => 'NO_PREFERENCE',
                'user_action' => 'PAY_NOW',
                'return_url'  => $returnUrl,
                'cancel_url'  => $cancelUrl,
            ],
        ];

        Log::info('PayPal create package payment request', [
            'payment_id' => $payment->id,
            'package_id' => $package->id,
            'vnd_amount' => $vndAmount,
            'usd_amount' => $usdAmount,
            'payload' => $payload
        ]);

        $res = Http::withToken($token)
            ->acceptJson()
            ->asJson()
            ->post($this->base . '/v2/checkout/orders', $payload);

        if (!$res->successful()) {
            Log::error('PayPal create package order failed', [
                'status' => $res->status(),
                'body' => $res->body(),
                'payment_id' => $payment->id
            ]);
            throw new RuntimeException('PayPal create order failed: ' . $res->body());
        }

        $data = $res->json();
        $approve = collect($data['links'] ?? [])->first(fn($l) => ($l['rel'] ?? '') === 'approve');

        if (!$approve || empty($approve['href'])) {
            Log::error('PayPal approve URL not found (package)', ['response' => $data]);
            throw new RuntimeException('PayPal approve URL not found.');
        }

        $payment->update([
            'reference' => $reference,
            'external_id' => $data['id'] ?? null,
            'metadata' => array_merge($payment->metadata ?? [], [
                'paypal_order_id' => $data['id'] ?? null,
            ]),
        ]);

        return $approve['href'];
    }

    public function handleReturn(array $payload): array
    {
        $status  = $payload['status'] ?? 'success';
        $orderId = $payload['order_id'] ?? null;
        $token   = $payload['token'] ?? null;
        $packagePaymentId = $payload['package_payment'] ?? null;

        Log::info('PayPal return handler called', [
            'payload' => $payload,
            'status' => $status,
            'order_id' => $orderId,
            'token' => $token
        ]);

        if ($status === 'cancel') {
            if ($packagePaymentId) {
                return [
                    'status' => 'canceled',
                    'transaction_id' => null,
                    'message' => 'User canceled payment',
                    'package_payment_id' => (int) $packagePaymentId,
                ];
            }

            Log::info('PayPal payment canceled by user', ['order_id' => $orderId]);
            return [
                'status' => 'canceled',
                'transaction_id' => null,
                'message' => 'User canceled payment',
            ];
        }

        if (!$orderId || !$token) {
            Log::error('PayPal return missing required parameters', $payload);
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Missing order_id or token',
            ];
        }

        try {
            $access = $this->getAccessToken();

            Log::info('PayPal capturing payment', [
                'token' => $token,
                'order_id' => $orderId
            ]);

            $res = Http::withToken($access)
                ->acceptJson()
                ->withBody('{}', 'application/json')
                ->post($this->base . "/v2/checkout/orders/{$token}/capture");

            if (!$res->successful()) {
                Log::error('PayPal capture failed', [
                    'status' => $res->status(),
                    'body' => $res->body(),
                    'token' => $token
                ]);
                return [
                    'status' => 'failed',
                    'transaction_id' => null,
                    'message' => 'Capture failed: ' . $res->body(),
                    'package_payment_id' => $packagePaymentId ? (int) $packagePaymentId : null,
                ];
            }

            $pp = $res->json();
            Log::info('PayPal capture response', ['response' => $pp]);

            if (($pp['status'] ?? '') !== 'COMPLETED') {
                Log::error('PayPal capture not completed', [
                    'status' => $pp['status'] ?? 'unknown',
                    'response' => $pp
                ]);
                return [
                    'status' => 'failed',
                    'transaction_id' => $pp['id'] ?? null,
                    'message' => 'Capture not completed: ' . ($pp['status'] ?? 'unknown'),
                    'package_payment_id' => $packagePaymentId ? (int) $packagePaymentId : null,
                ];
            }

            $captureId = isset($pp['purchase_units'][0]['payments']['captures'][0]['id'])
                ? $pp['purchase_units'][0]['payments']['captures'][0]['id']
                : ($pp['id'] ?? null);

            if ($packagePaymentId) {
                return [
                    'status' => 'succeeded',
                    'transaction_id' => $captureId,
                    'message' => 'Payment captured successfully',
                    'package_payment_id' => (int) $packagePaymentId,
                    'raw' => $pp,
                ];
            }

            $this->completePayment($orderId, $captureId, $pp);

            return [
                'status' => 'succeeded',
                'transaction_id' => $captureId,
                'message' => 'Payment captured successfully',
            ];

        } catch (\Throwable $e) {
            Log::error('PayPal return handler exception', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'order_id' => $orderId
            ]);

            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Exception: ' . $e->getMessage(),
                'package_payment_id' => $packagePaymentId ? (int) $packagePaymentId : null,
            ];
        }
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        Log::info('PayPal webhook received', ['payload' => $payload]);
        return ['status' => 'ignored', 'transaction_id' => null, 'message' => 'Webhook not implemented'];
    }

    // FIX 4: Complete payment với logic tương tự Stripe
    private function completePayment(string $orderId, ?string $captureId, array $paypalResponse): void
    {
        DB::transaction(function () use ($orderId, $captureId, $paypalResponse) {
            $order = Order::with(['items', 'user'])->lockForUpdate()->findOrFail($orderId);
            
            if ($order->status === 'paid') {
                Log::info('Order already paid', ['order_id' => $orderId]);
                return;
            }

            // Trừ stock cho từng item (tương tự Stripe)
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

            // XÓA ITEMS KHỎI GIỎ HÀNG (tương tự Stripe)
            $cart = Cart::where('user_id', $order->user_id)->first();
            if ($cart) {
                foreach ($order->items as $orderItem) {
                    $cart->items()
                        ->where('product_id', $orderItem->product_id)
                        ->where('product_variant_id', $orderItem->product_variant_id)
                        ->delete();
                }
            }

            // Cập nhật payment và tạo transaction
            $payment = Payment::where('order_id', $order->id)
                ->where('provider', 'paypal')
                ->first();

            if ($payment) {
                $payment->update([
                    'status' => 'succeeded',
                    'transaction_id' => $captureId,
                    'gateway_event_id' => $paypalResponse['id'] ?? null,
                    'paid_at' => now(),
                    'raw_payload' => $paypalResponse,
                ]);

                Transaction::create([
                    'payment_id' => $payment->id,
                    'gateway' => 'paypal',
                    'transaction_code' => $captureId,
                    'status' => 'succeeded',
                    'amount' => $order->total_amount,
                    'processed_at' => now(),
                ]);
            }

            // Cập nhật order
            $order->update(['status' => 'paid']);

            // Xử lý promotion (tương tự Stripe)
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

            Log::info('PayPal payment completed successfully', [
                'order_id' => $orderId,
                'capture_id' => $captureId,
                'order_status' => 'paid'
            ]);
        });
    }

    // FIX 5: Chuyển đổi VND sang USD
    private function convertVndToUsd(float $vndAmount): string
    {
        // Tỷ giá xấp xỉ: 1 USD = 24,000 VND (cập nhật theo thực tế)
        $exchangeRate = 24000;
        $usdAmount = $vndAmount / $exchangeRate;
        
        // PayPal yêu cầu tối thiểu $0.01
        $usdAmount = max(0.01, $usdAmount);
        
        return number_format($usdAmount, 2, '.', '');
    }

    // FIX 6: Build items array với conversion
    private function buildItemsArray(Order $order): array
    {
        $items = [];
        $totalUsd = 0;
        
        foreach ($order->items as $item) {
            $vndPrice = (float) $item->price;
            $usdPrice = $vndPrice / 24000; // Chuyển đổi VND sang USD
            $usdPrice = max(0.01, $usdPrice); // Tối thiểu $0.01
            
            $itemUsd = [
                'name' => $item->product->name ?? 'Product',
                'unit_amount' => [
                    'currency_code' => 'USD',
                    'value' => number_format($usdPrice, 2, '.', ''),
                ],
                'quantity' => (string) $item->quantity,
            ];
            
            $items[] = $itemUsd;
            $totalUsd += $usdPrice * $item->quantity;
        }
        
        return $items;
    }

    private function getAccessToken(): string
    {
        $res = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->acceptJson()
            ->asForm()
            ->post($this->base . '/v1/oauth2/token', ['grant_type' => 'client_credentials']);

        if (!$res->successful()) {
            Log::error('PayPal OAuth failed', [
                'status' => $res->status(),
                'body' => $res->body()
            ]);
            throw new RuntimeException('PayPal OAuth failed: ' . $res->body());
        }
        
        $token = $res->json()['access_token'] ?? '';
        if (empty($token)) {
            throw new RuntimeException('PayPal OAuth token empty');
        }
        
        return (string) $token;
    }
}