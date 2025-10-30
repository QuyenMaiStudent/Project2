<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Payments\Gateways\StripeGateway;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\StripeClient;
use Stripe\Webhook;
use Throwable;

class PaymentWebhookController extends Controller
{
    public function stripe(Request $request)
    {
        $secret   = config('services.stripe.webhook_secret');
        $payload  = $request->getContent();
        $sig      = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $sig, $secret);
        } catch (Throwable $e) {
            Log::warning('Stripe webhook signature invalid', ['error' => $e->getMessage()]);
            return response('Invalid signature', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $s = $event->data->object;
            $orderId = $s->metadata->order_id ?? null;
            $pi      = $s->payment_intent ?? null;
            $this->complete($orderId, $pi, $event->id);
            return response('OK', 200);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $piObj   = $event->data->object;
            $orderId = $piObj->metadata->order_id ?? null;
            if (!$orderId && $piObj->id) {
                try {
                    $sessions = app(StripeClient::class)->checkout->sessions->all([
                        'payment_intent' => $piObj->id,
                        'limit' => 1,
                    ]);
                    if (!empty($sessions->data[0]->metadata->order_id)) {
                        $orderId = $sessions->data[0]->metadata->order_id;
                    }
                } catch (Throwable $e) {
                    Log::warning('Failed to lookup session', ['error' => $e->getMessage()]);
                }
            }

            $this->complete($orderId, $piObj->id ?? null, $event->id);
            return response('OK', 200);
        }
        
        return response('Event ignored', 200);
    }

    private function complete(?string $orderId, ?string $pi, string $eventId): void
    {
        if (!$orderId) {
            Log::warning('Webhook: No order ID found', ['event_id' => $eventId]);
            return;
        }
        
        // Sử dụng method từ StripeGateway để đảm bảo logic consistent
        $gateway = app(StripeGateway::class);
        $gateway->completePayment($orderId, $pi, $eventId);
    }

    public function momo(Request $req)
    {
        return $this->generic('momo', $req);
    }
    
    public function vnpay(Request $req)
    {
        return $this->generic('vnpay', $req);
    }

    private function generic(string $provider, Request $req)
    {
        try {
            $gateway = PaymentService::make($provider);
            $result = $gateway->handleWebhook($req->all());
            $orderId = $req->input('orderId') ?? $req->input('vnp_TxnRef');
            
            if ($orderId && $order = Order::find($orderId)) {
                $payment = $order->payment;
                
                // Map status để đảm bảo tương thích với enum
                $mappedStatus = $this->mapPaymentStatus($result['status']);
                
                $payment->update([
                    'status' => $mappedStatus,
                    'transaction_id' => $result['transaction_id'] ?? $payment->transaction_id,
                    'raw_payload' => $req->all(),
                    'gateway_event_id' => $req->input('eventId') ?? null,
                ]);
                
                // Cập nhật order status
                $orderStatus = $this->mapOrderStatus($mappedStatus);
                $order->update([
                    'status' => $orderStatus
                ]);
                
                Log::info('Payment updated via webhook', [
                    'provider' => $provider,
                    'order_id' => $orderId,
                    'payment_status' => $mappedStatus,
                    'order_status' => $orderStatus
                ]);
            } else {
                Log::warning('Order not found for webhook', [
                    'provider' => $provider,
                    'order_id' => $orderId
                ]);
            }
            
        } catch (Throwable $e) {
            Log::error('Webhook processing failed', [
                'provider' => $provider,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response('Webhook processing failed', 500);
        }
        
        return response('OK');
    }

    /**
     * Map các status từ payment gateway về enum values
     */
    private function mapPaymentStatus(string $status): string
    {
        return match(strtolower($status)) {
            'success', 'completed', 'paid', 'succeeded' => 'succeeded',
            'pending', 'processing', 'waiting' => 'pending',
            'failed', 'error', 'declined' => 'failed',
            'canceled', 'cancelled', 'voided' => 'canceled',
            'refunded', 'refund' => 'refunded',
            default => 'pending' // fallback safety
        };
    }

    /**
     * Map payment status sang order status (đã fix để khớp với enum orders)
     */
    private function mapOrderStatus(string $paymentStatus): string
    {
        return match($paymentStatus) {
            'succeeded' => 'paid',           // Bây giờ 'paid' đã có trong enum
            'failed' => 'cancelled',        // Map 'failed' -> 'cancelled' 
            'canceled' => 'cancelled',      // Map 'canceled' -> 'cancelled'
            'refunded' => 'cancelled',      // Map 'refunded' -> 'cancelled'
            default => 'placed'             // Default -> 'placed' thay vì 'pending'
        };
    }
}
