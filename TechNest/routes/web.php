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
use App\Http\Controllers\ProductSearchController;
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
Route::get('/test-place-order', function () {
    Log::info('Test place order route called');
    return 'Test route works';
});

// Public read
Route::get('/comments/{productId}', [CommentController::class, 'index'])->name('comments.index');

// Auth required (customer & seller both)
Route::middleware('auth')->group(function () {
    Route::post('/comments/{productId}', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{id}/like', [CommentController::class, 'like'])->name('comments.like');
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

Route::get('/test-zego', function () {
    return response()->json([
        'appID' => config('zego.app_id'),
        'serverSecret' => config('zego.server_secret'),
        'env_app_id' => env('ZEGO_APP_ID'),
        'env_server_secret' => env('ZEGO_SERVER_SECRET'),
    ]);
});

// Search product
Route::get('/products/search', [ProductSearchController::class, 'index'])
    ->name('products.search');

// Test Cloudinary configuration and upload
Route::get('/test-cloudinary', function () {
    try {
        $config = config('services.cloudinary');

        Log::info('Testing Cloudinary connection', [
            'config' => [
                'cloud_name' => $config['cloud_name'] ?? 'NOT_SET',
                'api_key' => $config['api_key'] ? 'SET' : 'NOT_SET',
                'api_secret' => $config['api_secret'] ? 'SET' : 'NOT_SET',
            ]
        ]);

        // Sử dụng file ảnh có sẵn thay vì tạo mới
        $testImagePath = public_path('favicon.ico'); // Hoặc bất kỳ file ảnh nào có sẵn

        // Hoặc tạo file text đơn giản
        if (!file_exists($testImagePath)) {
            $testImagePath = storage_path('app/test.txt');
            file_put_contents($testImagePath, 'Test content for Cloudinary');
        }

        $result = \CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary::upload($testImagePath, [
            'folder' => 'test',
            'public_id' => 'test_' . time(),
            'resource_type' => 'auto' // Tự động detect loại file
        ]);

        return response()->json([
            'success' => true,
            'url' => $result->getSecurePath(),
            'public_id' => $result->getPublicId(),
            'config' => [
                'cloud_name' => $config['cloud_name'] ?? 'NOT_SET',
                'api_key' => $config['api_key'] ? 'SET' : 'NOT_SET',
            ]
        ]);
    } catch (\Exception $e) {
        Log::error('Cloudinary test failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);

        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
            'config' => config('services.cloudinary')
        ]);
    }
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/seller.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/customer.php';
require __DIR__ . '/live.php';
