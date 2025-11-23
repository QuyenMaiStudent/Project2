<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ManageUserController;
use App\Http\Controllers\Admin\AdminPromotionController;
use App\Http\Controllers\Admin\BrandController;
use App\Http\Controllers\Admin\ManageLocationController;
use App\Http\Controllers\Admin\ManageShipperController;
use App\Http\Controllers\Subscription\PackageController as AdminPackageController;
use App\Http\Controllers\Subscription\RenewalController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    
    // Product management (admin) - single management page, filter by seller via ?seller=ID
    Route::get('/admin/products', [AdminProductController::class, 'index'])->name('admin.products.index');

    // show product detail (admin)
    Route::get('/admin/products/{product}', [AdminProductController::class, 'show'])->name('admin.products.show');

    // update categories for product
    Route::post('/admin/products/{product}/categories', [AdminProductController::class, 'updateCategories'])->name('admin.products.updateCategories');

    // update product status directly (admin)
    Route::post('/admin/products/{product}/status', [AdminProductController::class, 'updateStatus'])->name('admin.products.updateStatus');

    // THÊM: Route cho toggle active
    Route::patch('/admin/products/{product}/toggle-active', [AdminProductController::class, 'toggleActive'])->name('admin.products.toggleActive');

    Route::get('/admin/categories', [CategoryController::class, 'index'])->name('admin.categories.index');

    Route::post('/admin/categories', [CategoryController::class, 'store'])->name('admin.categories.store');
    Route::put('/admin/categories/{category}/update', [CategoryController::class, 'update'])->name('admin.categories.update');
    Route::delete('/admin/categories/{category}/delete', [CategoryController::class, 'destroy'])->name('admin.categories.destroy');

    // Manage users routes (no delete route) — NO route-level superadmin middleware any more.
    // Controller will determine access and frontend will show message instead of redirect.
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
    // EDIT/UPDATE removed — editing promotions is disabled
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

    Route::prefix('/admin/packages')->name('admin.packages.')->group(function () {
        Route::get('/', [AdminPackageController::class, 'adminIndex'])->name('index');
        Route::post('/', [AdminPackageController::class, 'store'])->name('store');
        Route::post('/{package}/toggle', [AdminPackageController::class, 'toggleStatus'])->name('toggle');
        Route::post('/renewals/run', [RenewalController::class, 'run'])->name('renewals.run');
    });

    // Manage shippers routes - CHỈ XEM, KHÔNG TẠO/SỬA/XÓA
    Route::prefix('admin/shippers')->name('admin.shippers.')->group(function () {
        Route::get('/', [ManageShipperController::class, 'index'])->name('index');
        Route::get('/{shipper}', [ManageShipperController::class, 'show'])->name('show');
    });
});
?>