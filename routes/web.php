<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Chat\ChatBotController;
use App\Http\Controllers\Chat\ChatController;
use App\Http\Controllers\Payments\PaymentReturnController;
use App\Http\Controllers\Payments\PaymentWebhookController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProductIndexController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\Customer\CustomerReviewController;
use Cloudinary\Cloudinary;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Public product routes
Route::get('/products', ProductIndexController::class)->name('products.index');
Route::get('/products/{product}/reviews', [CustomerReviewController::class, 'index'])->name('products.reviews.index');
Route::get('/products/{id}', ProductDetailController::class)->name('products.detail');

Route::get('/chat/chatbot', function () {
    return Inertia::render('ChatUI/ChatBot');
})->name('chat.chatbot');

// Payment return routes - đảm bảo route này tồn tại
Route::get('/payments/{provider}/return', [PaymentReturnController::class, 'handle'])
    ->name('payments.return');

// Webhook routes (không cần auth/middleware)
Route::post('/webhooks/stripe', [PaymentWebhookController::class, 'stripe'])
    ->name('webhooks.stripe');
Route::post('/webhooks/momo', [PaymentWebhookController::class, 'momo']);
Route::post('/webhooks/vnpay', [PaymentWebhookController::class, 'vnpay']);

// PayPal
Route::post('/webhooks/paypal', [PaymentWebhookController::class, 'paypalWebhook'])->name('paypal.webhook');

// Momo
Route::post('/webhooks/momo', [PaymentReturnController::class, 'momoReturn'])->name('momo');
Route::post('/webhooks/momo/ipn', [PaymentWebhookController::class, 'momo']);

// VnPay
Route::post('/payments/vnpay/ipn', [PaymentWebhookController::class, 'vnpay']);

// Thêm dòng này để load customer routes
Route::middleware('web')->group(base_path('routes/customer.php'));

// Test route để kiểm tra
Route::get('/test-place-order', function() {
    Log::info('Test place order route called');
    return 'Test route works';
});

// Public read
Route::get('/comments/{productId}', [CommentController::class, 'index'])->name('comments.index');

// Auth required (customer & seller both)
Route::middleware('auth')->group(function () {
    Route::post('/comments/{productId}', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{id}/like', [CommentController::class, 'like'])->name('comments.like');
    Route::get('/comments/{id}/check-like', [CommentController::class, 'checkLike'])->name('comments.check-like');
    Route::post('/comments/{id}/report', [CommentController::class, 'report'])->name('comments.report');
    // admin actions
    Route::post('/comments/{id}/pin', [CommentController::class, 'pin'])->name('comments.pin')->middleware('can:admin');
    Route::post('/comments/{id}/hide', [CommentController::class, 'hide'])->name('comments.hide')->middleware('can:admin');
});

//Chat routes
Route::middleware('auth')->group(function () {
    Route::get('/chat', [ChatController::class, 'index'])->name('chat.index');
    Route::get('/chat/{conversation}', [ChatController::class, 'show'])->name('chat.show');
    Route::get('/chat/{conversation}/messages', [ChatController::class, 'getMessages'])->name('chat.messages.get');
    Route::post('/chat/{conversation}/messages', [ChatController::class, 'store'])->name('chat.messages.store');
    Route::post('/chat/start', [ChatController::class, 'startConversation'])->name('chat.start');
});

// Seller routes
Route::middleware(['auth', 'verified'])->prefix('seller')->name('seller.')->group(function () {
    // ...existing seller routes...
    
    Route::get('/products/{product}/check-cart', [ProductController::class, 'checkCart'])->name('products.check-cart');
    Route::post('/products/{product}/clear-cart-items', [ProductController::class, 'clearCartItems'])->name('products.clear-cart-items');
    
    // ...existing seller routes...
});



require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/seller.php';
require __DIR__.'/admin.php';
require __DIR__.'/customer.php';
require __DIR__.'/live.php';
require __DIR__.'/shipper.php';