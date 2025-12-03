<?php

namespace App\Http\Controllers\Payments;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentReturnController extends Controller
{
    public function handle(Request $req, string $provider)
    {
        $gateway = PaymentService::make($provider);
        $result = $gateway->handleReturn($req->all());

        $orderId = $req->query('order_id')
            ?? $req->input('orderId')
            ?? $req->input('vnp_TxnRef');

        $order = null;
        if ($orderId) {
            $order = Order::with(['items.product', 'items.variant', 'payment'])
                ->find($orderId);
            
            if ($order) {
                $payment = $order->payment;
                if ($payment) {
                    $payment->update([
                        'raw_payload' => $req->all(),
                    ]);
                }
            }
        }

        return Inertia::render('Customer/PaymentResult', [
            'provider' => $provider,
            'status' => $result['status'],
            'message' => $result['message'],
            'order' => $order ? [
                'id' => $order->id,
                'total_amount' => $order->total_amount,
                'discount_amount' => $order->discount_amount,
                'status' => $order->status,
                'placed_at' => $order->placed_at?->format('d/m/Y H:i'),
                'items_count' => $order->items->count(),
            ] : null,
        ]);
    }
}
