<?php

use App\Http\Controllers\LiveStreamController;
use App\Http\Controllers\Seller\SellerLiveController;
use App\Http\Controllers\Customer\ViewerController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::get('/live', [LiveStreamController::class, 'index'])->name('live.index');
Route::get('/live/{liveStream}', [ViewerController::class, 'show'])->name('live.view');

// Seller routes
Route::middleware(['auth', 'seller'])->group(function () {
    Route::get('/seller/live', [SellerLiveController::class, 'dashboard'])->name('seller.live.dashboard');
    Route::post('/seller/live/start', [SellerLiveController::class, 'start'])->name('seller.live.start');
    Route::get('/seller/live/{liveStream}/stream', [SellerLiveController::class, 'stream'])->name('seller.live.stream');
    Route::post('/seller/live/{liveStream}/end', [SellerLiveController::class, 'end'])->name('seller.live.end');
});

// Customer routes
Route::middleware(['auth'])->group(function () {
    Route::post('/live/{liveStream}/join', [ViewerController::class, 'join'])->name('live.join');
});