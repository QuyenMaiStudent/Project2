<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Chat\ChatBotController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProductIndexController;
use App\Http\Controllers\Seller\ProductController;
use App\Http\Controllers\CommentController;
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

// Comments routes (web)
Route::prefix('products')->group(function() {
    Route::get('{productId}/comments', [CommentController::class, 'index'])->name('comments.index');
    Route::post('{productId}/comments', [CommentController::class, 'store'])->middleware('auth')->name('comments.store');
    Route::get('comments/{id}', [CommentController::class, 'show'])->name('comments.show');
    Route::put('comments/{id}', [CommentController::class, 'update'])->middleware('auth')->name('comments.update');
    Route::delete('comments/{id}', [CommentController::class, 'destroy'])->middleware('auth')->name('comments.destroy');
    Route::post('comments/{id}/report', [CommentController::class, 'report'])->middleware('auth')->name('comments.report');
    Route::post('comments/{id}/like', [CommentController::class, 'like'])->middleware('auth')->name('comments.like');
    Route::post('comments/{id}/pin', [CommentController::class, 'pin'])->middleware('auth')->name('comments.pin');
    Route::post('comments/{id}/hide', [CommentController::class, 'hide'])->middleware('auth')->name('comments.hide');
});

Route::get('/chat/chatbot', function () {
    return Inertia::render('ChatUI/ChatBot');
})->name('chat.chatbot');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/seller.php';
require __DIR__.'/admin.php';
require __DIR__.'/customer.php';
