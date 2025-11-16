<?php

use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\ShippingAddressController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\CustomerReviewController;
use App\Http\Controllers\Customer\TransactionController;
use App\Http\Controllers\Subscription\PackageController;
use App\Http\Controllers\Subscription\PackagePaymentController;
use App\Http\Controllers\Subscription\PackagePaymentReturnController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer'])->group(function () {
    // Thêm route dashboard cho customer
    Route::get('customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/delete/{id}', [CartController::class, 'destroy'])->name('cart.delete');
    Route::post('/cart/clear', [CartController::class, 'clearAll'])->name('cart.clear');

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

    //Transaction routes
    Route::get('/transactions', [TransactionController::class, 'index'])->name('customer.transactions.index');
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('customer.transactions.show');
    Route::get('/transactions/{transaction}/invoice', [TransactionController::class, 'invoice'])->name('customer.transactions.invoice');

    Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
    Route::post('/packages/{package}/subscribe', [PackageController::class, 'subscribe'])->name('packages.subscribe');

    Route::get('/packages/{package}/checkout', [PackagePaymentController::class, 'checkout'])->name('packages.checkout');
    Route::post('/packages/{package}/pay', [PackagePaymentController::class, 'pay'])->name('packages.pay');
    Route::get('/packages/payment/return', PackagePaymentReturnController::class)->name('packages.payment.return');

    Route::post('/packages/subscriptions/{subscription}/cancel', [PackageController::class, 'cancel'])->name('packages.cancel');
    Route::post('/packages/subscriptions/{subscription}/toggle-auto-renew', [PackageController::class, 'toggleAutoRenew'])->name('packages.toggleAutoRenew');

    Route::get('/customer/reviews/can-review/{product}', [CustomerReviewController::class, 'canReview'])->name('customer.reviews.canReview');
    Route::post('/customer/reviews', [CustomerReviewController::class, 'store'])->name('customer.reviews.store');
});
