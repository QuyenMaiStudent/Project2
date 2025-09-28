<?php

use App\Http\Controllers\Admin\AdminProductController\AdminProductController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'is_admin'])->group(function () {
    Route::get('/admin/products/pending', [AdminProductController::class, 'pending'])->name('admin.products.pending');
    Route::get('/admin/products/approved', [AdminProductController::class, 'approved'])->name('admin.products.approved');
    Route::get('/admin/products/rejected', [AdminProductController::class, 'rejected'])->name('admin.products.rejected');
});
?>