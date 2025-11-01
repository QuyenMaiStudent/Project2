<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ManageUserController;
use App\Http\Controllers\Admin\AdminPromotionController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\LocationController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // product review / admin actions
    Route::get('/admin/products/pending', [AdminProductController::class, 'pending'])->name('admin.products.pending');
    Route::get('/admin/products/approved', [AdminProductController::class, 'approved'])->name('admin.products.approved');
    Route::get('/admin/products/rejected', [AdminProductController::class, 'rejected'])->name('admin.products.rejected');

    // show product detail (admin)
    Route::get('/admin/products/{product}', [AdminProductController::class, 'show'])->name('admin.products.show');

    // cập nhật categories cho product (admin gán sau khi đã duyệt)
    Route::post('/admin/products/{product}/categories', [AdminProductController::class, 'updateCategories'])->name('admin.products.updateCategories');

    // approve / reject
    Route::post('/admin/products/{product}/approve', [AdminProductController::class, 'approve'])->name('admin.products.approve');
    Route::post('/admin/products/{product}/reject', [AdminProductController::class, 'reject'])->name('admin.products.reject');

    Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories.index');

    Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/admin/categories/{category}/update', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}/delete', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Manage users routes
    Route::get('/admin/users', [ManageUserController::class, 'index'])->name('admin.users.index');
    Route::get('/admin/users/create', [ManageUserController::class, 'create'])->name('admin.users.create');
    Route::post('/admin/users', [ManageUserController::class, 'store'])->name('admin.users.store');
    Route::get('/admin/users/{id}/edit', [ManageUserController::class, 'edit'])->name('admin.users.edit');
    Route::put('/admin/users/{id}', [ManageUserController::class, 'update'])->name('admin.users.update');
    Route::post('/admin/users/{id}/assign-role', [ManageUserController::class, 'assignRole'])->name('admin.users.assignRole');
    Route::post('/admin/users/{id}/toggle-status', [ManageUserController::class, 'toggleStatus'])->name('admin.users.toggleStatus');

    // Admin promotions
    Route::get('/admin/promotions', [AdminPromotionController::class, 'index'])->name('admin.promotions.index');
    Route::get('/admin/promotions/create', [AdminPromotionController::class, 'create'])->name('admin.promotions.create');
    Route::post('/admin/promotions', [AdminPromotionController::class, 'store'])->name('admin.promotions.store');
    Route::get('/admin/promotions/{id}/edit', [AdminPromotionController::class, 'edit'])->name('admin.promotions.edit');
    Route::put('/admin/promotions/{id}', [AdminPromotionController::class, 'update'])->name('admin.promotions.update');
    Route::delete('/admin/promotions/{id}', [AdminPromotionController::class, 'destroy'])->name('admin.promotions.destroy');
    Route::post('/admin/promotions/{id}/toggle-status', [AdminPromotionController::class, 'toggleStatus'])->name('admin.promotions.toggleStatus');
    Route::post('/admin/promotions/{id}/assign-targets', [AdminPromotionController::class, 'assignTargets'])->name('admin.promotions.assignTargets');
    Route::get('/admin/promotions/{id}/usage', [AdminPromotionController::class, 'usageStats'])->name('admin.promotions.usage');

    // Brand
    Route::get('/admin/brands', [BrandController::class, 'index'])->name('admin.brands.index');
    Route::get('/admin/brands/create', [BrandController::class, 'create'])->name('admin.brands.create');
    Route::post('/admin/brands', [BrandController::class, 'store'])->name('admin.brands.store');
    Route::get('/admin/brands/{id}/edit', [BrandController::class, 'edit'])->name('admin.brands.edit');
    Route::put('/admin/brands/{id}', [BrandController::class, 'update'])->name('admin.brands.update');
    Route::delete('/admin/brands/{id}', [BrandController::class, 'destroy'])->name('admin.brands.destroy');


// ============================
    // LOCATION MANAGEMENT (Tỉnh / Huyện / Xã)
    // ============================
    Route::get('/admin/locations', [LocationController::class, 'index'])->name('admin.locations.index');
    Route::get('/admin/locationtest', [LocationController::class, 'index'])->name('admin.locationtest');


    // --- TỈNH / THÀNH PHỐ ---
    Route::get('/admin/locations/provinces', [LocationController::class, 'listProvinces']);
    Route::post('/admin/locations/provinces', [LocationController::class, 'storeProvince']);
    Route::put('/admin/locations/provinces/{id}', [LocationController::class, 'updateProvince']);
    Route::delete('/admin/locations/provinces/{id}', [LocationController::class, 'deleteProvince']);

    // --- QUẬN / HUYỆN ---
    Route::get('/admin/locations/provinces/{provinceId}/districts', [LocationController::class, 'listDistricts']);
    Route::post('/admin/locations/provinces/{provinceId}/districts', [LocationController::class, 'storeDistrict']);
    Route::put('/admin/locations/districts/{id}', [LocationController::class, 'updateDistrict']);
    Route::delete('/admin/locations/districts/{id}', [LocationController::class, 'deleteDistrict']);

    // --- PHƯỜNG / XÃ ---
    Route::get('/admin/locations/districts/{districtId}/wards', [LocationController::class, 'listWards']);
    Route::post('/admin/locations/districts/{districtId}/wards', [LocationController::class, 'storeWard']);
    Route::put('/admin/locations/wards/{id}', [LocationController::class, 'updateWard']);
    Route::delete('/admin/locations/wards/{id}', [LocationController::class, 'deleteWard']);
});?>
