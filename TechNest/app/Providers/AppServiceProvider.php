<?php

namespace App\Providers;

use App\Models\Cart;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
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
