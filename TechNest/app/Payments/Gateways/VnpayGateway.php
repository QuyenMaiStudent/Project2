<?php

namespace App\Payments\Gateways;

use App\Models\Cart;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\Promotion;
use App\Models\Transaction;
use App\Payments\Contracts\PaymentGateway;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VnpayGateway implements PaymentGateway
{
    protected string $tmnCode;
    protected string $secret;
    protected string $paymentUrl;
    protected string $returnUrl;
    protected int $convertRate;

    public function __construct()
    {
        $cfg = config('services.vnpay');
        $this->tmnCode    = (string) $cfg['tmn_code'];
        $this->secret     = (string) $cfg['hash_secret'];
        $this->paymentUrl = (string) $cfg['payment_url'];
        $this->returnUrl  = (string) $cfg['return_url'];
        $this->convertRate = (int) ($cfg['convert_rate'] ?? 27000);
    }

    public function createPayment(Order $order): string
    {
        // FIX 1: Sử dụng total_amount thay vì amount
        $amountVnd = $this->toVndInt($order->total_amount, 'VND');
        $vnpAmount = $amountVnd * 100;

        $params = [
            'vnp_Version'   => '2.1.0',
            'vnp_Command'   => 'pay',
            'vnp_TmnCode'   => $this->tmnCode,
            'vnp_Amount'    => $vnpAmount,
            'vnp_CurrCode'  => 'VND',
            'vnp_TxnRef'    => (string) $order->id,
            'vnp_OrderInfo' => 'Thanh toan don hang #' . $order->id,
            'vnp_OrderType' => 'other',
            'vnp_Locale'    => 'vn',
            'vnp_ReturnUrl' => route('payments.return', ['provider' => 'vnpay']),
            'vnp_IpAddr'    => request()?->ip() ?? '127.0.0.1',
            'vnp_CreateDate' => now()->format('YmdHis'),
        ];

        $url = $this->signedUrl($params);

        // FIX 2: Tạo Payment record đầy đủ
        Payment::updateOrCreate(
            ['order_id' => $order->id],
            [
                'provider' => 'vnpay',
                'status' => 'pending',
                'amount' => $order->total_amount,
                'currency' => 'VND',
                'transaction_id' => $params['vnp_TxnRef'],
                'gateway_event_id' => $params['vnp_TxnRef'],
            ]
        );

        Log::info('VNPay payment created', [
            'order_id' => $order->id,
            'amount_vnd' => $amountVnd,
            'vnp_amount' => $vnpAmount,
            'url' => $url
        ]);

        return $url;
    }

    public function handleReturn(array $payload): array
    {
        Log::info('VNPay return handler called', ['payload' => $payload]);

        if (!$this->verifySignature($payload)) {
            Log::error('VNPay signature verification failed', ['payload' => $payload]);
            return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Invalid signature'];
        }

        $code = $payload['vnp_ResponseCode'] ?? null;
        $transNo = (string) ($payload['vnp_TransactionNo'] ?? '');
        $orderId = (string) ($payload['vnp_TxnRef'] ?? '');

        if ($code === '00') {
            // FIX 3: Xử lý thành công ngay tại return handler
            try {
                $this->completePayment($orderId, $transNo, $payload);
                
                return [
                    'status' => 'succeeded', 
                    'transaction_id' => $transNo ?: null, 
                    'message' => 'Payment completed successfully'
                ];
            } catch (\Throwable $e) {
                Log::error('VNPay payment completion failed in return handler', [
                    'error' => $e->getMessage(),
                    'order_id' => $orderId,
                    'trans_no' => $transNo
                ]);
                
                return [
                    'status' => 'failed', 
                    'transaction_id' => $transNo ?: null, 
                    'message' => 'Payment completion failed: ' . $e->getMessage()
                ];
            }
        }

        if ($code === '24') {
            return ['status' => 'canceled', 'transaction_id' => null, 'message' => 'User canceled'];
        }

        return ['status' => 'failed', 'transaction_id' => null, 'message' => 'VNPay error code: ' . $code];
    }

    public function handleWebhook(array $payload, ?string $signature = null): array
    {
        Log::info('VNPay webhook/IPN received', ['payload' => $payload]);

        if (!$this->verifySignature($payload)) {
            Log::error('VNPay IPN signature verification failed', ['payload' => $payload]);
            return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Invalid signature'];
        }

        $orderId = (string) ($payload['vnp_TxnRef'] ?? '');
        $resp    = (string) ($payload['vnp_ResponseCode'] ?? '');
        $transNo = (string) ($payload['vnp_TransactionNo'] ?? '');

        if ($resp !== '00') {
            return ['status' => 'failed', 'transaction_id' => $transNo ?: null, 'message' => 'Payment failed: ' . $resp];
        }

        // FIX: Kiểm tra xem payment đã complete chưa
        $order = Order::find($orderId);
        if ($order && $order->status === 'paid') {
            Log::info('Order already completed by return handler', ['order_id' => $orderId]);
            return ['status' => 'succeeded', 'transaction_id' => $transNo ?: null, 'message' => 'Payment already completed'];
        }

        // Nếu chưa complete thì complete tại đây
        try {
            $this->completePayment($orderId, $transNo, $payload);
            
            return ['status' => 'succeeded', 'transaction_id' => $transNo ?: null, 'message' => 'Payment completed via webhook'];
        } catch (\Throwable $e) {
            Log::error('VNPay payment completion failed', [
                'error' => $e->getMessage(),
                'order_id' => $orderId,
                'trans_no' => $transNo
            ]);
            
            return ['status' => 'failed', 'transaction_id' => $transNo ?: null, 'message' => 'Payment completion failed: ' . $e->getMessage()];
        }
    }

    // FIX 4: Tách logic complete payment thành method riêng
    private function completePayment(string $orderId, string $transNo, array $vnpayResponse): void
    {
        DB::transaction(function () use ($orderId, $transNo, $vnpayResponse) {
            $order = Order::with(['items', 'user'])->lockForUpdate()->findOrFail($orderId);
            
            if ($order->status === 'paid') {
                Log::info('Order already paid', ['order_id' => $orderId]);
                return; // Không throw exception, chỉ return
            }

            // Trừ stock cho từng item
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
                    $affected = Product::where('id', $item->product_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);
                    
                    if ($affected === 0) {
                        throw new \RuntimeException("Không đủ tồn kho cho sản phẩm ID {$item->product_id}");
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

            // Cập nhật payment và tạo transaction
            $payment = Payment::where('order_id', $order->id)
                ->where('provider', 'vnpay')
                ->first();

            if ($payment) {
                $payment->update([
                    'status' => 'succeeded',
                    'transaction_id' => $transNo,
                    'gateway_event_id' => $vnpayResponse['vnp_TransactionNo'] ?? null,
                    'paid_at' => now(),
                    'raw_payload' => $vnpayResponse,
                ]);

                Transaction::create([
                    'payment_id' => $payment->id,
                    'gateway' => 'vnpay',
                    'transaction_code' => $transNo,
                    'status' => 'succeeded',
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

            Log::info('VNPay payment completed successfully', [
                'order_id' => $orderId,
                'trans_no' => $transNo,
                'order_status' => 'paid'
            ]);
        });
    }

    private function toVndInt(float $amount, string $currency): int
    {
        if (strtoupper($currency) === 'VND') {
            return (int) round($amount);
        }
        return (int) round($amount * max(1, $this->convertRate));
    }

    private function signedUrl(array $params): string
    {
        ksort($params);
        $hashData = '';
        foreach ($params as $k => $v) {
            if ($hashData !== '') $hashData .= '&';
            $hashData .= urlencode($k) . '=' . urlencode($v);
        }

        $secureHash = hash_hmac('sha512', $hashData, $this->secret);
        Log::debug('VNPay signature creation', ['hashData' => $hashData, 'hash' => $secureHash]);
        
        $params['vnp_SecureHash'] = $secureHash;

        return $this->paymentUrl . '?' . http_build_query($params);
    }

    private function verifySignature(array $payload): bool
    {
        $input = [];
        foreach ($payload as $k => $v) {
            if (strpos($k, 'vnp_') === 0 && $k !== 'vnp_SecureHash') {
                $input[$k] = $v;
            }
        }
        ksort($input);

        $data = '';
        foreach ($input as $k => $v) {
            if ($data !== '') $data .= '&';
            $data .= urlencode($k) . '=' . urlencode($v);
        }

        $calc = hash_hmac('sha512', $data, $this->secret);
        $recv = (string)($payload['vnp_SecureHash'] ?? '');

        Log::debug('VNPay signature verification', [
            'data' => $data, 
            'calculated' => $calc, 
            'received' => $recv
        ]);

        return hash_equals($calc, $recv);
    }
}