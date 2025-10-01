<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    Route::get('/admin/products/pending', [AdminProductController::class, 'pending'])->name('admin.products.pending');
    Route::get('/admin/products/approved', [AdminProductController::class, 'approved'])->name('admin.products.approved');
    Route::get('/admin/products/rejected', [AdminProductController::class, 'rejected'])->name('admin.products.rejected');
    Route::get('/admin/products/{product}', [AdminProductController::class, 'show'])->name('admin.products.show');
    Route::post('/admin/products/{product}/approve', [AdminProductController::class, 'approve'])->name('admin.products.approve');
    Route::post('/admin/products/{product}/reject', [AdminProductController::class, 'reject'])->name('admin.products.reject');
});
?>