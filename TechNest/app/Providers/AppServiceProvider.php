<?php

namespace App\Providers;

use App\Models\Cart;
use App\Payments\Gateways\MomoGateway;
use App\Payments\Gateways\PaypalGateway;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Stripe\StripeClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        // Stripe
        $this->app->singleton(StripeClient::class, function () {
            return new StripeClient(config('services.stripe.secret'));
        });

        // PayPal Gateway
        $this->app->bind(PaypalGateway::class, fn() => new PaypalGateway());

        // MoMo Gateway
        $this->app->bind(MomoGateway::class, fn() => new MomoGateway());
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Tổng số lượng item trong giỏ hàng
        Inertia::share([
            'isCustomer' => function () {
                $user = Auth::user();
                return $user ? (bool) $user->isCustomer() : false;
            },

            'cartCount' => function () {
                $user = Auth::user();
                if (!$user) {
                    return 0;
                }

                $cart = Cart::firstWhere('user_id', $user->id);
                if (!$cart) {
                    return 0;
                }

                return (int) $cart->items()->sum('quantity');
            },
        ]);
    }
}
