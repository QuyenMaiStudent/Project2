<?php
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\SellerController;
use Illuminate\Support\Facades\Route;
// Seller routes
Route::middleware(['auth', 'seller'])->group(function () {
    Route::get('/seller/dashboard', [SellerController::class, 'dashboard'])->name('seller.dashboard');

    // Add product
    Route::get('/seller/products/create', [ProductController::class, 'create'])->name('seller.products.create');
    Route::post('/seller/products', [ProductController::class, 'store'])->name('seller.products.store');

    // View product list
    Route::get('/seller/products', [ProductController::class, 'index'])->name('seller.products.index');
});