<?php

use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\ShippingAddressController;
use App\Http\Controllers\Customer\CheckoutController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer'])->group(function () {
    // Thêm route dashboard cho customer
    Route::get('customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/delete/{id}', [CartController::class, 'destroy'])->name('cart.delete');

    Route::get('/shipping-addresses', [ShippingAddressController::class, 'index'])->name('shipping_addresses.index');
    Route::post('/shipping-addresses', [ShippingAddressController::class, 'store'])->name('shipping_addresses.store');
    Route::put('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'update'])->name('shipping_addresses.update');
    Route::delete('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'destroy'])->name('shipping_addresses.destroy');

    // Checkout routes (GET moved to CheckoutController)
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('customer.checkout');
    Route::post('/checkout', [OrderController::class, 'placeOrder'])->name('customer.checkout.placeOrder');

    // Order routes
    Route::get('/orders', [OrderController::class, 'index'])->name('customer.orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('customer.orders.show');
    
    // Thêm route này để PaymentResult có thể redirect đúng
    Route::get('/customer/orders/{order}', [OrderController::class, 'show'])->name('customer.orders.detail');
});