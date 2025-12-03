<?php

use App\Http\Controllers\Chat\ChatBotController;
use App\Http\Controllers\ProductSearchController;
use Illuminate\Support\Facades\Route;

Route::post('/chat/chatbot', [ChatBotController::class, 'chat']);
Route::get('/products/search', [ProductSearchController::class, 'search']);