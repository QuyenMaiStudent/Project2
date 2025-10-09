<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ManageUserController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    Route::get('/admin/products/pending', [AdminProductController::class, 'pending'])->name('admin.products.pending');
    Route::get('/admin/products/approved', [AdminProductController::class, 'approved'])->name('admin.products.approved');
    Route::get('/admin/products/rejected', [AdminProductController::class, 'rejected'])->name('admin.products.rejected');
    Route::get('/admin/products/{product}', [AdminProductController::class, 'show'])->name('admin.products.show');
    Route::post('/admin/products/{product}/categories', [AdminProductController::class, 'updateCategories'])->name('admin.products.updateCategories');
    Route::post('/admin/products/{product}/approve', [AdminProductController::class, 'approve'])->name('admin.products.approve');
    Route::post('/admin/products/{product}/reject', [AdminProductController::class, 'reject'])->name('admin.products.reject');

    Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories.index');

    Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/admin/categories/{category}/update', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}/delete', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Manage users routes (no delete route)
    Route::get('/admin/users', [ManageUserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/create', [ManageUserController::class, 'create'])->name('admin.users.create');
    Route::post('/admin/users', [ManageUserController::class, 'store'])->name('admin.users.store');
    Route::get('/admin/users/{id}/edit', [ManageUserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/admin/users/{id}', [ManageUserController::class, 'update'])->name('admin.users.update');
    Route::post('/admin/users/{id}/assign-role', [ManageUserController::class, 'assignRole'])->name('admin.users.assignRole');
    Route::post('/admin/users/{id}/toggle-status', [ManageUserController::class, 'toggleStatus'])->name('admin.users.toggleStatus');
});
?>