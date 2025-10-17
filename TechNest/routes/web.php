<?php

use App\Http\Controllers\Auth\GoogleController;
use App\Http\Controllers\Chat\ChatBotController;
use App\Http\Controllers\ProductDetailController;
use App\Http\Controllers\ProductIndexController;
use App\Http\Controllers\Seller\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/auth/google', [GoogleController::class, 'redirectToGoogle'])->name('auth.google');
Route::get('/auth/google/callback', [GoogleController::class, 'handleGoogleCallback'])->name('auth.google.callback');

// Public product routes
Route::get('/products', ProductIndexController::class)->name('products.index');
Route::get('/products/{id}', ProductDetailController::class)->name('products.detail');

Route::get('/chat/chatbot', function () {
    return Inertia::render('ChatUI/ChatBot');
})->name('chat.chatbot');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/seller.php';
require __DIR__.'/admin.php';
require __DIR__.'/customer.php';
