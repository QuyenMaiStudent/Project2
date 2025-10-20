<?php

use App\Http\Controllers\Chat\ChatBotController;
use Illuminate\Support\Facades\Route;

Route::post('/chat/chatbot', [ChatBotController::class, 'chat']);