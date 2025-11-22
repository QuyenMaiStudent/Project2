<?php

use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Customer\OrderTrackingController;
use App\Http\Controllers\Customer\ShippingAddressController;
use App\Http\Controllers\Customer\CheckoutController;
use App\Http\Controllers\Customer\CustomerReviewController;
use App\Http\Controllers\Customer\TransactionController;
use App\Http\Controllers\Subscription\PackageController;
use App\Http\Controllers\Subscription\PackagePaymentController;
use App\Http\Controllers\Subscription\PackagePaymentReturnController;
use App\Http\Controllers\Customer\CustomerOrderDeliveryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer'])->group(function () {
    Route::get('customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');

    // Cart routes
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/delete/{id}', [CartController::class, 'destroy'])->name('cart.delete');
    Route::post('/cart/clear', [CartController::class, 'clearAll'])->name('cart.clear');

    // Shipping addresses
    Route::get('/shipping-addresses', [ShippingAddressController::class, 'index'])->name('shipping_addresses.index');
    Route::post('/shipping-addresses', [ShippingAddressController::class, 'store'])->name('shipping_addresses.store');
    Route::put('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'update'])->name('shipping_addresses.update');
    Route::delete('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'destroy'])->name('shipping_addresses.destroy');

    // Checkout
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('customer.checkout');
    Route::post('/checkout', [OrderController::class, 'placeOrder'])->name('customer.checkout.placeOrder');

    // Order management routes
    Route::get('/orders', [OrderController::class, 'index'])->name('customer.orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('customer.orders.show');
    Route::get('/customer/orders/{order}', [OrderController::class, 'show'])->name('customer.orders.detail');
    
    // Order actions
    Route::post('/customer/orders/{order}/retry-payment', [OrderController::class, 'retryPayment'])->name('customer.orders.retry-payment');
    Route::post('/customer/orders/{order}/cancel', [OrderController::class, 'cancel'])->name('customer.orders.cancel');
    Route::get('/customer/orders/{order}/refund-request', [OrderController::class, 'refundRequest'])->name('customer.orders.refund-request');

    // Order tracking routes (separate from order management)
    Route::get('/tracking', [OrderTrackingController::class, 'index'])->name('customer.tracking.index');
    Route::get('/tracking/{order}', [OrderTrackingController::class, 'show'])->name('customer.tracking.show');
    Route::post('/customer/orders/{order}/confirm-received', [CustomerOrderDeliveryController::class, 'confirm'])->name('customer.orders.confirm-received');

    // Transaction routes
    Route::get('/transactions', [TransactionController::class, 'index'])->name('customer.transactions.index');
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('customer.transactions.show');
    Route::get('/transactions/{transaction}/invoice', [TransactionController::class, 'invoice'])->name('customer.transactions.invoice');

    // Package routes
    Route::get('/packages', [PackageController::class, 'index'])->name('packages.index');
    Route::post('/packages/{package}/subscribe', [PackageController::class, 'subscribe'])->name('packages.subscribe');
    Route::get('/packages/{package}/checkout', [PackagePaymentController::class, 'checkout'])->name('packages.checkout');
    Route::post('/packages/{package}/pay', [PackagePaymentController::class, 'pay'])->name('packages.pay');
    Route::get('/packages/payment/return', PackagePaymentReturnController::class)->name('packages.payment.return');
    Route::post('/packages/subscriptions/{subscription}/cancel', [PackageController::class, 'cancel'])->name('packages.cancel');
    Route::post('/packages/subscriptions/{subscription}/toggle-auto-renew', [PackageController::class, 'toggleAutoRenew'])->name('packages.toggleAutoRenew');

    // Review routes
    Route::get('/customer/reviews/can-review/{product}', [CustomerReviewController::class, 'canReview'])->name('customer.reviews.canReview');
    Route::post('/customer/reviews', [CustomerReviewController::class, 'store'])->name('customer.reviews.store');
});
