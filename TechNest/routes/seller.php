<?php
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\Seller\ProductImageController;
use App\Http\Controllers\Seller\ProductSpecController;
use App\Http\Controllers\Seller\ProductVariantController;
use App\Http\Controllers\Seller\SellerController;
use App\Http\Controllers\Seller\SellerOrderController;
use App\Http\Controllers\Seller\SellerPromotionController;
use App\Http\Controllers\Seller\SellerStoreController;
use Illuminate\Support\Facades\Route;

// Seller routes
Route::middleware(['auth', 'seller'])->group(function () {
    Route::get('/seller/dashboard', [SellerController::class, 'dashboard'])->name('seller.dashboard');

    // Add product
    Route::get('/seller/products/create', [ProductController::class, 'create'])->name('seller.products.create');
    Route::post('/seller/products', [ProductController::class, 'store'])->name('seller.products.store');

    // View product list
    Route::get('/seller/products', [ProductController::class, 'index'])->name('seller.products.index');

    // Edit product
    Route::get('/seller/products/{product}/edit', [ProductController::class, 'edit'])->name('seller.products.edit');
    Route::put('/seller/products/{product}', [ProductController::class, 'update'])->name('seller.products.update');

    // Upload nhiều ảnh
    Route::get('/seller/products/upload-images', [ProductImageController::class, 'showUploadImages'])->name('seller.products.show-upload-images');
    Route::post('/seller/products/{product}/upload-images', [ProductImageController::class, 'uploadImages'])->name('seller.products.upload-images');
    Route::delete('/seller/products/{product}/images/{image}', [ProductImageController::class, 'deleteImage'])->name('seller.products.delete-image');

    // Thông số sản phẩm
    Route::get('/seller/products/{product}/specs', [ProductSpecController::class, 'index'])->name('seller.products.specs.index');
    Route::post('/seller/products/{product}/specs', [ProductSpecController::class, 'store',])->name('seller.products.specs.store');
    Route::put('/seller/products/{product}/specs/{spec}', [ProductSpecController::class, 'update'])->name('seller.products.specs.update');
    Route::delete('/seller/products/{product}/specs/{spec}', [ProductSpecController::class, 'destroy'])->name('seller.products.specs.destroy');

    // Biến thể sản phẩm
    Route::get('/seller/products/{product}/variants', [ProductVariantController::class, 'index'])->name('seller.products.variants.index');
    Route::post('/seller/products/{product}/variants', [ProductVariantController::class, 'store'])->name('seller.products.variants.store');
    // Accept both PUT (API) and POST (frontend FormData via router.post)
    Route::match(['put', 'post'], '/seller/products/{product}/variants/{variant}', [ProductVariantController::class, 'update'])->name('seller.products.variants.update');
    Route::delete('/seller/products/{product}/variants/{variant}', [ProductVariantController::class, 'destroy'])->name('seller.products.variants.destroy');

    // Toggle product visibility
    Route::post('/seller/products/{product}/toggle-visibility', [ProductController::class, 'toggleVisibility'])->name('seller.products.toggle-visibility');

    // Xem trước
    Route::get('seller/products/{product}/preview', [ProductController::class, 'preview'])->name('seller.products.preview');
    //Duyệt
    Route::post('seller/products/{product}/submit', [ProductController::class, 'submitForApproval'])->name('seller.products.submit');

    // Seller promotions
    Route::get('/seller/promotions', [SellerPromotionController::class, 'index'])->name('seller.promotions.index');
    Route::get('/seller/promotions/create', [SellerPromotionController::class, 'create'])->name('seller.promotions.create');
    Route::post('/seller/promotions', [SellerPromotionController::class, 'store'])->name('seller.promotions.store');
    Route::get('/seller/promotions/{id}/edit', [SellerPromotionController::class, 'edit'])->name('seller.promotions.edit');
    Route::put('/seller/promotions/{id}', [SellerPromotionController::class, 'update'])->name('seller.promotions.update');
    Route::delete('/seller/promotions/{id}', [SellerPromotionController::class, 'destroy'])->name('seller.promotions.destroy');
    Route::post('/seller/promotions/{id}/toggle-status', [SellerPromotionController::class, 'toggleStatus'])->name('seller.promotions.toggleStatus');
    Route::get('/seller/promotions/{id}/usage', [SellerPromotionController::class, 'usageStats'])->name('seller.promotions.usageStats');

    Route::get('/seller/store', [SellerStoreController::class, 'show'])->name('seller.store.show');
    Route::post('/seller/store/location', [SellerStoreController::class, 'update'])->name('seller.store.update');

    Route::get('/seller/orders', [SellerOrderController::class, 'index'])->name('seller.orders.index');
    Route::get('/seller/orders/{order}', [SellerOrderController::class, 'show'])->name('seller.orders.show');
    Route::post('/seller/orders/{order}/request-shipment', [SellerOrderController::class, 'requestShipment'])->name('seller.orders.request-shipment');
});