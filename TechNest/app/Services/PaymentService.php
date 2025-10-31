<?php
namespace App\Services;

use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\PaypalGateway;
use App\Payments\Gateways\StripeGateway;
use InvalidArgumentException;

class PaymentService
{
    public static function make(string $provider): PaymentGateway
    {
        $provider = strtolower($provider);
        
        return match($provider) {
            'stripe' => app(StripeGateway::class),
            'paypal' => app(PaypalGateway::class),
            //'momo' => app(MomoGateway::class),
            //'vnpay' => app(VnpayGateway::class),
            default => throw new InvalidArgumentException("Unsupported payment provider: {$provider}"),
        };
    }
}