<?php

namespace App\Payments\Gateways;

use App\Models\Order;
use App\Models\Payment;
use App\Models\ProductVariant;
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

    public function createPayment(Order $order): string
    {
        $rate = $this->fetchVndToUsdRate();

        $currency = config('services.stripe.currency', 'usd');
        $lineItems = $order->items->map(function ($item) use ($rate, $currency) {
            $unitUsd = round((float)$item->price * $rate, 2);
            $unitCents = max(50, (int) round($unitUsd * 100)); // Tối thiểu 50 cents cho Stripe

            return [
                'price_data' => [
                    'currency'     => $currency,
                    'product_data' => ['name' => $item->product->name],
                    'unit_amount'  => $unitCents,
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
            ],
            // Thêm các option để đảm bảo redirect
            'automatic_tax' => ['enabled' => false],
            'billing_address_collection' => 'auto',
        ]);

        Log::info('Stripe session created', [
            'session_id' => $session->id,
            'order_id' => $order->id,
            'url' => $session->url
        ]);

        return $session->url;
    }

    public function handleReturn(array $payload): array
    {
        $status = $payload['status'] ?? 'cancel';
        if ($status === 'success') return ['status' => 'succeeded', 'transaction_id' => $payload['session_id'] ?? null, 'message' => 'Checkout completed'];
        if ($status === 'cancel')  return ['status' => 'canceled',  'transaction_id' => null, 'message' => 'User canceled'];
        return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Unknown status'];
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

        if (!$sessionId || !$orderId) {
            return ['status' => 'failed', 'transaction_id' => null, 'message' => 'Missing session/order metadata'];
        }

        DB::transaction(function () use ($orderId, $pi, $eventId) {
            $order = Order::with(['items'])->lockForUpdate()->findOrFail($orderId);

            if ($order->status === 'paid') {
                Log::info('Order already paid', ['order_id' => $order->id]);
                return;
            }

            // Trừ stock cho từng item
            foreach ($order->items as $item) {
                $qty = (int) $item->quantity;

                // Nếu có variant, trừ stock từ variant
                if ($item->product_variant_id) {
                    $affected = ProductVariant::where('id', $item->product_variant_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);

                    if ($affected === 0) {
                        throw new RuntimeException("Không đủ tồn kho cho variant ID {$item->product_variant_id}");
                    }

                    Log::info('Stock decremented for variant', [
                        'variant_id' => $item->product_variant_id,
                        'quantity' => $qty
                    ]);
                } else {
                    // Nếu không có variant, trừ stock từ product
                    $affected = DB::table('products')
                        ->where('id', $item->product_id)
                        ->where('stock', '>=', $qty)
                        ->decrement('stock', $qty);

                    if ($affected === 0) {
                        throw new RuntimeException("Không đủ tồn kho cho sản phẩm ID {$item->product_id}");
                    }

                    Log::info('Stock decremented for product', [
                        'product_id' => $item->product_id,
                        'quantity' => $qty
                    ]);
                }
            }

            // Cập nhật payment
            Payment::where('order_id', $order->id)
                ->where('provider', 'stripe')
                ->update([
                    'status'           => 'succeeded',
                    'transaction_id'   => $pi,
                    'gateway_event_id' => $eventId,
                    'paid_at'          => now(),
                ]);

            // Cập nhật order status
            $order->update(['status' => 'paid']);

            Log::info('Payment webhook completed', [
                'order_id' => $order->id,
                'event_id' => $eventId
            ]);
        });

        return ['status' => 'succeeded', 'transaction_id' => $pi, 'message' => 'Stock decremented & order paid'];
    }
}
