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
use App\Models\Package;
use App\Models\PackagePayment;
use Illuminate\Support\Str;

class MomoGateway implements PaymentGateway
{
    protected string $partnerCode;
    protected string $accessKey;
    protected string $secretKey;
    protected string $endpoint;
    protected string $redirectUrl;
    protected string $ipnUrl;
    protected int $convertRate;

    public function __construct()
    {
        $cfg = config('services.momo');
        $this->partnerCode = (string) $cfg['partner_code'];
        $this->accessKey   = (string) $cfg['access_key'];
        $this->secretKey   = (string) $cfg['secret_key'];
        $this->endpoint    = (string) $cfg['endpoint'];
        $this->redirectUrl = (string) $cfg['redirect'];
        $this->ipnUrl      = (string) $cfg['ipn'];
        $this->convertRate = (int) ($cfg['convert_rate'] ?? 25000);
    }

    public function createPayment(Order $order): string
    {
        // FIX 1: Sử dụng total_amount thay vì amount
        $amountVnd = $this->amountToVndInt($order->total_amount, 'VND');

        $requestId = (string) now()->timestamp . rand(1000, 9999);
        $orderId   = (string) $order->id;
        $orderInfo = 'Thanh toan don hang #' . $orderId;
        $extraData = base64_encode(json_encode(['order_id' => $orderId]));

        $payload = [
            'partnerCode' => $this->partnerCode,
            'accessKey'   => $this->accessKey,
            'requestId'   => $requestId,
            'amount'      => (string) $amountVnd,
            'orderId'     => $orderId,
            'orderInfo'   => $orderInfo,
            'redirectUrl' => route('payments.return', ['provider' => 'momo']),
            'ipnUrl'      => $this->ipnUrl,
            'lang'        => 'vi',
            'extraData'   => $extraData,
            'requestType' => 'captureWallet',
        ];

        $payload['signature'] = $this->signCreate($payload);

        Log::info('MoMo create payment request', [
            'order_id' => $order->id,
            'amount_vnd' => $amountVnd,
            'payload' => $payload
        ]);

        $res = Http::timeout(15)->acceptJson()->asJson()->post($this->endpoint, $payload);
        
        if (!$res->successful()) {
            Log::error('MoMo create failed', [
                'status' => $res->status(),
                'body' => $res->body(),
                'order_id' => $order->id
            ]);
            throw new \RuntimeException('MoMo create failed: ' . $res->body());
        }
        
        $data = $res->json();

        if (($data['resultCode'] ?? -1) !== 0 || empty($data['payUrl'])) {
            Log::error('MoMo rejected', [
                'result_code' => $data['resultCode'] ?? -1,
                'message' => $data['message'] ?? 'Unknown error',
                'response' => $data
            ]);
            throw new \RuntimeException('MoMo rejected: ' . ($data['message'] ?? 'Unknown error'));
        }

        // FIX 2: Tạo Payment record đầy đủ thông tin
        Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'provider' => 'momo',
                'status' => 'pending',
                'amount' => $order->total_amount,
                'currency' => 'VND',
                'transaction_id' => $requestId,
                'gateway_event_id' => $data['orderId'] ?? $orderId,
            ]
        );

        Log::info('MoMo payment created successfully', [
            'order_id' => $order->id,
            'request_id' => $requestId,
            'pay_url' => $data['payUrl']
        ]);

        return $data['payUrl'];
    }

    /**
     * Create payment for a Package (not Order) and return redirect URL.
     * Non-destructive: does not change existing createPayment(Order $order).
     */
    public function createPackagePayment(Package $package, PackagePayment $payment): string
    {
        $amountVnd = $this->amountToVndInt((float) $package->price, 'VND');

        $requestId = (string) now()->timestamp . rand(1000, 9999);
        $orderId = 'PKG-' . $payment->id;
        $orderInfo = 'Thanh toan package #' . $package->id;
        $extraData = base64_encode(json_encode([
            'package_id' => $package->id,
            'user_id' => $payment->user_id,
            'package_payment_id' => $payment->id,
        ]));

        $payload = [
            'partnerCode' => $this->partnerCode,
            'accessKey'   => $this->accessKey,
            'requestId'   => $requestId,
            'amount'      => (string) $amountVnd,
            'orderId'     => $orderId,
            'orderInfo'   => $orderInfo,
            'redirectUrl' => $payment->return_url,
            'ipnUrl'      => $this->ipnUrl,
            'lang'        => 'vi',
            'extraData'   => $extraData,
            'requestType' => 'captureWallet',
        ];

        $payload['signature'] = $this->signCreate($payload);

        Log::info('MoMo create package payment request', [
            'payment_id' => $payment->id,
            'package_id' => $package->id,
            'amount_vnd' => $amountVnd,
            'payload' => $payload,
        ]);

        $res = Http::timeout(15)->acceptJson()->asJson()->post($this->endpoint, $payload);

        if (!$res->successful()) {
            Log::error('MoMo create package failed', [
                'status' => $res->status(),
                'body' => $res->body(),
                'payment_id' => $payment->id,
            ]);
            throw new \RuntimeException('MoMo create failed: ' . $res->body());
        }

        $data = $res->json();

        if (($data['resultCode'] ?? -1) !== 0 || empty($data['payUrl'])) {
            Log::error('MoMo rejected (package)', [
                'result_code' => $data['resultCode'] ?? -1,
                'message' => $data['message'] ?? 'Unknown error',
                'response' => $data,
                'payment_id' => $payment->id,
            ]);
            throw new \RuntimeException('MoMo rejected: ' . ($data['message'] ?? 'Unknown error'));
        }

        $payment->update([
            'reference' => $orderId,
            'external_id' => $data['orderId'] ?? $orderId,
            'metadata' => array_merge($payment->metadata ?? [], [
                'request_id' => $requestId,
            ]),
        ]);

        return $data['payUrl'];
    }

    public function handleReturn(array $payload): array
    {
        Log::info('MoMo return handler called', ['payload' => $payload]);

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $message    = (string) ($payload['message'] ?? 'Unknown');
        $orderId    = (string) ($payload['orderId'] ?? '');
        $transId    = (string) ($payload['transId'] ?? '');

        if ($packagePaymentId = $this->resolvePackagePaymentId($orderId)) {
            $status = match ($resultCode) {
                0 => 'succeeded',
                49 => 'canceled',
                default => 'failed',
            };

            return [
                'status' => $status,
                'transaction_id' => $transId ?: null,
                'message' => $message,
                'package_payment_id' => $packagePaymentId,
            ];
        }

        if ($resultCode === 0) {
            try {
                $this->completePayment($orderId, $transId, $payload);

                return [
                    'status' => 'succeeded',
                    'transaction_id' => $transId,
                    'message' => 'Payment completed successfully'
                ];
            } catch (\Throwable $e) {
                Log::error('MoMo payment completion failed in return handler', [
                    'error' => $e->getMessage(),
                    'order_id' => $orderId,
                    'trans_id' => $transId
                ]);

                return [
                    'status' => 'failed',
                    'transaction_id' => $transId ?: null,
                    'message' => 'Payment completion failed: ' . $e->getMessage()
                ];
            }
        }
        
        if ($resultCode === 49) {
            return [
                'status' => 'canceled', 
                'transaction_id' => null, 
                'message' => 'User canceled payment'
            ];
        }
        
        return [
            'status' => 'failed', 
            'transaction_id' => null, 
            'message' => $message
        ];
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        Log::info('MoMo webhook/IPN received', ['payload' => $payload]);

        if (!$this->verifyIpn($payload)) {
            Log::error('MoMo IPN signature verification failed', ['payload' => $payload]);
            return [
                'status' => 'failed',
                'transaction_id' => null,
                'message' => 'Invalid signature'
            ];
        }

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $orderId    = (string) ($payload['orderId'] ?? '');
        $transId    = (string) ($payload['transId'] ?? '');
        $message    = (string) ($payload['message'] ?? '');

        if ($packagePaymentId = $this->resolvePackagePaymentId($orderId)) {
            $status = $resultCode === 0 ? 'succeeded' : 'failed';

            return [
                'status' => $status,
                'transaction_id' => $transId ?: null,
                'message' => $message,
                'package_payment_id' => $packagePaymentId,
            ];
        }

        $resultCode = (int) ($payload['resultCode'] ?? -1);
        $orderId    = (string) ($payload['orderId'] ?? '');
        $transId    = (string) ($payload['transId'] ?? '');
        $message    = (string) ($payload['message'] ?? '');

        if ($resultCode !== 0) {
            Log::warning('MoMo payment failed', [
                'result_code' => $resultCode,
                'message' => $message,
                'order_id' => $orderId
            ]);
            return [
                'status' => 'failed', 
                'transaction_id' => $transId ?: null, 
                'message' => $message ?: 'Payment failed'
            ];
        }

        // FIX: Kiểm tra xem payment đã complete chưa
        $order = Order::find($orderId);
        if ($order && $order->status === 'paid') {
            Log::info('Order already completed by return handler', ['order_id' => $orderId]);
            return [
                'status' => 'succeeded', 
                'transaction_id' => $transId ?: null, 
                'message' => 'Payment already completed'
            ];
        }

        // Nếu chưa complete thì complete tại đây
        try {
            $this->completePayment($orderId, $transId, $payload);
            
            return [
                'status' => 'succeeded', 
                'transaction_id' => $transId ?: null, 
                'message' => 'Payment completed successfully via webhook'
            ];
        } catch (\Throwable $e) {
            Log::error('MoMo payment completion failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId,
                'trans_id' => $transId
            ]);
            
            return [
                'status' => 'failed', 
                'transaction_id' => $transId ?: null, 
                'message' => 'Payment completion failed: ' . $e->getMessage()
            ];
        }
    }

    // FIX 5: Tách logic complete payment thành method riêng
    private function completePayment(string $orderId, string $transId, array $momoResponse): void
    {
        DB::transaction(function () use ($orderId, $transId, $momoResponse) {
            $order = Order::with(['items', 'user'])->lockForUpdate()->findOrFail($orderId);
            
            if ($order->status === 'paid') {
                Log::info('Order already paid', ['order_id' => $orderId]);
                return; // Không throw exception, chỉ return
            }

            // Trừ stock cho từng item (tương tự Stripe/PayPal)
            foreach ($order->items as $item) {
                $qty = (int) $item->quantity;
                
                if ($item->product_variant_id) {
                    $affected = ProductVariant::where('id', $item->product_variant_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);
                    
                    if ($affected === 0) {
                        throw new \RuntimeException("Không đủ tồn kho cho variant ID {$item->product_variant_id}");
                    }
                } else {
                    $affected = DB::table('products')
                        ->where('id', $item->product_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);
                    
                    if ($affected === 0) {
                        throw new \RuntimeException("Không đủ tồn kho cho sản phẩm ID {$item->product_id}");
                    }
                }
            }

            // XÓA ITEMS KHỎI GIỎ HÀNG (tương tự Stripe/PayPal)
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
                ->where('provider', 'momo')
                ->first();

            if ($payment) {
                $payment->update([
                    'status' => 'succeeded',
                    'transaction_id' => $transId,
                    'gateway_event_id' => $momoResponse['requestId'] ?? null,
                    'paid_at' => now(),
                    'raw_payload' => $momoResponse,
                ]);

                Transaction::create([
                    'payment_id' => $payment->id,
                    'gateway' => 'momo',
                    'transaction_code' => $transId,
                    'status' => 'succeeded',
                    'amount' => $order->total_amount,
                    'processed_at' => now(),
                ]);
            }

            // Cập nhật order
            $order->update(['status' => 'paid']);

            // Xử lý promotion (tương tự Stripe/PayPal)
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

            Log::info('MoMo payment completed successfully', [
                'order_id' => $orderId,
                'trans_id' => $transId,
                'order_status' => 'paid'
            ]);
        });
    }

    private function amountToVndInt(float $amount, ?string $currency): int
    {
        $currency = strtoupper((string)($currency ?? 'VND'));

        if ($currency === 'VND') {
            return (int) round($amount);
        }

        // Convert other currencies to VND
        return (int) round($amount * max(1, $this->convertRate));
    }

    private function signCreate(array $p): string
    {
        // FIX 6: Đảm bảo thứ tự parameters theo spec MoMo
        $raw = "accessKey={$p['accessKey']}"
            . "&amount={$p['amount']}"
            . "&extraData={$p['extraData']}"
            . "&ipnUrl={$p['ipnUrl']}"
            . "&orderId={$p['orderId']}"
            . "&orderInfo={$p['orderInfo']}"
            . "&partnerCode={$p['partnerCode']}"
            . "&redirectUrl={$p['redirectUrl']}"
            . "&requestId={$p['requestId']}"
            . "&requestType={$p['requestType']}";

        return hash_hmac('sha256', $raw, $this->secretKey);
    }

    private function verifyIpn(array $p): bool
    {
        // FIX 7: Đảm bảo thứ tự parameters theo spec MoMo cho IPN
        $keys = [
            'accessKey',
            'amount',
            'extraData',
            'message',
            'orderId',
            'orderInfo',
            'orderType',
            'partnerCode',
            'payType',
            'requestId',
            'responseTime',
            'resultCode',
            'transId'
        ];
        
        $kv = [];
        foreach ($keys as $k) {
            if (!array_key_exists($k, $p)) $p[$k] = '';
            $kv[] = $k . '=' . $p[$k];
        }
        
        $raw = implode('&', $kv);
        $sig = hash_hmac('sha256', $raw, $this->secretKey);
        
        Log::debug('MoMo signature verification', [
            'raw_string' => $raw,
            'calculated_sig' => $sig,
            'received_sig' => $p['signature'] ?? null
        ]);
        
        return hash_equals($sig, (string) ($p['signature'] ?? ''));
    }

    private function resolvePackagePaymentId(?string $reference): ?int
    {
        if (! $reference || ! Str::startsWith($reference, 'PKG-')) {
            return null;
        }

        return (int) Str::after($reference, 'PKG-');
    }
}
