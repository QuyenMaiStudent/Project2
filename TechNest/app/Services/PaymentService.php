<?php
namespace App\Services;

use App\Payments\Contracts\PaymentGateway;
use App\Payments\Gateways\StripeGateway;
use InvalidArgumentException;

class PaymentService
{
    public static function make(string $provider): PaymentGateway
    {
        // Chuyển về chữ thường để đảm bảo match
        $provider = strtolower($provider);
        
        return match($provider) {
            'stripe' => app(StripeGateway::class),
            // 'momo' => app(MomoGateway::class),
            // 'vnpay' => app(VnPayGateway::class),
            default => throw new InvalidArgumentException("Unsupported payment provider: {$provider}"),
        };
    }
}