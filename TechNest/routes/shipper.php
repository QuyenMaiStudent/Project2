<?php

use App\Http\Controllers\Shipper\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Shipper\Auth\RegisteredShipperController;
use App\Http\Controllers\Shipper\ShipperDashboardController;
use App\Http\Controllers\Shipper\ShipperOrderController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest:shipper')->group(function () {
    Route::get('/shipper/login', [AuthenticatedSessionController::class, 'create'])->name('shipper.login');
    Route::post('/shipper/login', [AuthenticatedSessionController::class, 'store'])->name('shipper.login.store');
    Route::get('/shipper/register', [RegisteredShipperController::class, 'create'])->name('shipper.register');
    Route::post('/shipper/register', [RegisteredShipperController::class, 'store'])->name('shipper.register.store');
});

Route::middleware('auth:shipper')->group(function () {
    // sau login vào dashboard
    Route::post('/shipper/logout', [AuthenticatedSessionController::class, 'destroy'])->name('shipper.logout');
    Route::get('/shipper/dashboard', [ShipperDashboardController::class, 'index'])->name('shipper.dashboard');
    Route::get('/shipper/orders', [ShipperOrderController::class, 'index'])->name('shipper.orders.index');
    Route::get('/shipper/orders/{order}', [ShipperOrderController::class, 'show'])->name('shipper.orders.show');
    Route::post('/shipper/orders/{order}/accept', [ShipperOrderController::class, 'accept'])->name('shipper.orders.accept');
    Route::post('/shipper/orders/{order}/mark-delivered', [ShipperOrderController::class, 'markDelivered'])->name('shipper.orders.mark-delivered');
});