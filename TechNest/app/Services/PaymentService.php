<?php
namespace App\Services;

use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\MomoGateway;
use App\Payments\Gateways\PaypalGateway;
use App\Payments\Gateways\StripeGateway;
use App\Payments\Gateways\VnpayGateway;
use App\Models\Order;
use App\Models\Package;
use App\Models\PackagePayment;
use InvalidArgumentException;
use Throwable;
use ReflectionMethod;
use ReflectionNamedType;

class PaymentService
{
    /**
     * Keep existing static factory for compatibility.
     */
    public static function make(string $provider): PaymentGateway
    {
        $provider = strtolower($provider);

        return match ($provider) {
            'stripe' => app(StripeGateway::class),
            'paypal' => app(PaypalGateway::class),
            'momo' => app(MomoGateway::class),
            'vnpay' => app(VnpayGateway::class),
            default => throw new InvalidArgumentException("Unsupported payment provider: {$provider}"),
        };
    }

    /**
     * Create a payment using the selected gateway.
     *
     * Supports gateways that expect:
     *  - array $payload  (returns array)
     *  - App\Models\Order $order (returns string or array) — we will instantiate a lightweight Order object (not persisted)
     *
     * @param array $payload
     * @return array
     */
    public function createPayment(array $payload): array
    {
        $gatewayKey = strtolower($payload['gateway'] ?? 'momo');

        try {
            $gateway = self::make($gatewayKey);

            if (! $gateway instanceof PaymentGateway) {
                throw new InvalidArgumentException("Gateway does not implement PaymentGateway: {$gatewayKey}");
            }

            if (isset($payload['metadata']['type']) && $payload['metadata']['type'] === 'package_subscription') {
                $pkgId = $payload['metadata']['package_id'] ?? null;
                $userId = $payload['metadata']['user_id'] ?? ($payload['user_id'] ?? null);

                $package = $pkgId ? Package::find($pkgId) : null;
                if (! $package) {
                    throw new InvalidArgumentException("Package not found: {$pkgId}");
                }

                $currency = strtoupper($payload['currency'] ?? ($payload['currency_code'] ?? 'VND'));
                $amount = $payload['amount'] ?? $payload['price'] ?? $package->price;

                $metadata = $payload['metadata'] ?? [];

                $packagePayment = PackagePayment::create([
                    'package_id' => $package->id,
                    'user_id' => $userId,
                    'gateway' => $gatewayKey,
                    'status' => 'pending',
                    'amount' => $amount,
                    'currency' => $currency,
                    'exchange_rate' => $payload['exchange_rate'] ?? null,
                    'metadata' => $metadata,
                    'cancel_url' => $payload['cancel_url'] ?? route('packages.index'),
                ]);

                $metadata['package_payment_id'] = $packagePayment->id;

                $packagePayment->update([
                    'metadata' => $metadata,
                    'return_url' => route('packages.payment.return', [
                        'gateway' => $gatewayKey,
                        'package_payment' => $packagePayment->id,
                    ]),
                ]);

                try {
                    if (! method_exists($gateway, 'createPackagePayment')) {
                        throw new InvalidArgumentException("Gateway does not support package payments: {$gatewayKey}");
                    }

                    $result = $gateway->createPackagePayment($package, $packagePayment->fresh());
                } catch (Throwable $e) {
                    $packagePayment->markFailed('failed', ['error' => $e->getMessage()]);
                    throw $e;
                }

                $normalized = $this->normalizeResult($result);
                $normalized['package_payment_id'] = $packagePayment->id;

                if (! isset($normalized['success'])) {
                    $normalized['success'] = ! empty($normalized['redirect_url']);
                }

                return $normalized;
            }

            // Inspect method signature of the gateway to decide how to call it
            $ref = new ReflectionMethod($gateway, 'createPayment');
            $params = $ref->getParameters();

            // if no params or first param is builtin/array -> call with payload array
            if (empty($params)) {
                $result = $ref->invoke($gateway, $payload);
                return $this->normalizeResult($result);
            }

            $firstParam = $params[0];
            $type = $firstParam->getType();

            if ($type instanceof ReflectionNamedType && ! $type->isBuiltin()) {
                $paramClass = $type->getName();

                // If gateway expects an Order (or subclass) => create a lightweight Order instance (do not persist)
                if ($paramClass === Order::class || is_subclass_of($paramClass, Order::class)) {
                    $order = new Order();

                    // populate common fields if present in payload — keep minimal and non-invasive
                    if (isset($payload['user_id'])) {
                        $order->user_id = $payload['user_id'];
                    }
                    $order->total = $payload['amount'] ?? $payload['price'] ?? 0;
                    $order->currency = $payload['currency'] ?? ($payload['currency_code'] ?? 'VND');
                    $order->description = $payload['description'] ?? $payload['desc'] ?? null;
                    // metadata: store raw payload if gateway inspects it
                    $order->metadata = $payload['metadata'] ?? null;

                    $result = $ref->invoke($gateway, $order);
                    return $this->normalizeResult($result);
                }

                // If other object type is expected, try to pass payload directly (best-effort)
                $result = $ref->invoke($gateway, $payload);
                return $this->normalizeResult($result);
            }

            // If parameter is builtin (likely 'array') or untyped, call with array
            $result = $ref->invoke($gateway, $payload);
            return $this->normalizeResult($result);
        } catch (Throwable $e) {
            // Log if desired: logger()->error('PaymentService error', ['err'=>$e->getMessage()]);
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Normalize gateway result to a predictable array form.
     */
    protected function normalizeResult($result): array
    {
        if (is_array($result)) {
            return $result;
        }

        if (is_string($result)) {
            // many older gateways return a redirect URL as string
            return [
                'success' => true,
                'redirect_url' => $result,
            ];
        }

        // fallback: wrap other return types
        return [
            'success' => true,
            'data' => $result,
        ];
    }
}