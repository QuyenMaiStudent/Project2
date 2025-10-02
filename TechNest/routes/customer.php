<?php

use App\Http\Controllers\Customer\CartController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\ShippingAddressController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'customer'])->group(function () {
    Route::get('/customer/dashboard', [CustomerController::class, 'dashboard'])->name('customer.dashboard');

    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::post('/cart/update/{id}', [CartController::class, 'update'])->name('cart.update');
    Route::post('/cart/delete/{id}', [CartController::class, 'destroy'])->name('cart.delete');

    Route::get('/shipping-addresses', [ShippingAddressController::class, 'index'])->name('shipping_addresses.index');
    Route::post('/shipping-addresses', [ShippingAddressController::class, 'store'])->name('shipping_addresses.store');
    Route::put('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'update'])->name('shipping_addresses.update');
    Route::delete('/shipping-addresses/{shippingAddress}', [ShippingAddressController::class, 'destroy'])->name('shipping_addresses.destroy');
});