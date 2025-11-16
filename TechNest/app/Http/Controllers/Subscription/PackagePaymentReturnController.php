<?php

namespace App\Http\Controllers\Subscription;

use App\Http\Controllers\Controller;
use App\Models\PackagePayment;
use App\Models\PackageSubscription;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PackagePaymentReturnController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $gateway = strtolower($request->input('gateway', $request->input('provider', '')));

        abort_unless($gateway, 404);

        $payload = $request->all();
        $result = [];

        try {
            $result = PaymentService::make($gateway)->handleReturn($payload);
        } catch (\Throwable $e) {
            $result = [
                'status' => 'failed',
                'message' => $e->getMessage(),
            ];
        }

        $packagePaymentId = $result['package_payment_id']
            ?? $request->input('package_payment')
            ?? $this->extractPackagePaymentId($payload);

        $payment = $packagePaymentId
            ? PackagePayment::with(['package', 'user'])->find($packagePaymentId)
            : null;

        if (! $payment) {
            return Inertia::render('Packages/PaymentReturn', [
                'status' => 'failed',
                'heading' => __('Payment not found'),
                'message' => __('We were unable to locate this package payment.'),
                'redirectUrl' => route('packages.index'),
            ]);
        }

        abort_unless($request->user()?->id === $payment->user_id, 403);

        $status = $result['status'] ?? 'failed';
        $message = $result['message'] ?? null;
        $transactionCode = $result['transaction_id'] ?? $this->extractTransactionCode($payload);

        if ($status === 'succeeded') {
            $this->finalizeSuccess($payment, $transactionCode, $payload, $gateway);
            $heading = __('Payment successful');
            $statusPayload = 'success';
            $message ??= __('Your subscription has been activated.');
        } elseif ($status === 'canceled') {
            $payment->markFailed('canceled', $payload);
            $heading = __('Payment canceled');
            $statusPayload = 'canceled';
            $message ??= __('The payment was canceled. No charges were made.');
        } else {
            $payment->markFailed('failed', $payload);
            $heading = __('Payment failed');
            $statusPayload = 'failed';
            $message ??= __('The payment could not be processed. Please try again.');
        }

        return Inertia::render('Packages/PaymentReturn', [
            'status' => $statusPayload,
            'heading' => $heading,
            'message' => $message,
            'redirectUrl' => route('packages.index'),
        ]);
    }

    private function finalizeSuccess(PackagePayment $payment, ?string $transactionCode, array $payload, string $gateway): void
    {
        if ($payment->status === 'succeeded') {
            return;
        }

        DB::transaction(function () use ($payment, $transactionCode, $payload, $gateway) {
            $payment->markSucceeded($transactionCode, $payload);

            $payment->transactions()->create([
                'gateway' => $gateway,
                'status' => 'succeeded',
                'type' => 'capture',
                'transaction_code' => $transactionCode,
                'amount' => $payment->amount,
                'processed_at' => now(),
                'payload' => $payload,
            ]);

            $subscription = PackageSubscription::firstOrNew([
                'package_id' => $payment->package_id,
                'user_id' => $payment->user_id,
            ]);

            $now = now();
            $baseDate = ($subscription->exists && $subscription->isActive() && $subscription->expires_at)
                ? $subscription->expires_at->copy()
                : $now->copy();

            $newExpiresAt = $baseDate->copy()->addDays($payment->package->duration_days);

            $subscription->fill([
                'status' => 'active',
                'auto_renew' => true,
                'price' => $payment->amount,
                'started_at' => $subscription->started_at ?? $now,
                'last_renewed_at' => $now,
                'expires_at' => $newExpiresAt,
                'next_renewal_at' => $newExpiresAt,
            ])->save();
        });
    }

    private function extractPackagePaymentId(array $payload): ?int
    {
        $orderId = $payload['orderId'] ?? $payload['vnp_TxnRef'] ?? $payload['order_id'] ?? null;

        if ($orderId && Str::startsWith($orderId, 'PKG-')) {
            return (int) Str::after($orderId, 'PKG-');
        }

        if (isset($payload['package_payment'])) {
            return (int) $payload['package_payment'];
        }

        if (isset($payload['package_payment_id'])) {
            return (int) $payload['package_payment_id'];
        }

        return null;
    }

    private function extractTransactionCode(array $payload): ?string
    {
        return $payload['transId']
            ?? $payload['vnp_TransactionNo']
            ?? $payload['transaction_id']
            ?? $payload['txn_id']
            ?? null;
    }
}
