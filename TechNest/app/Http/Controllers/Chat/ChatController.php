<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $conversations = Conversation::where('buyer_id', $user->id) // buyer_id = customer_id
            ->orWhere('seller_id', $user->id)
            ->with(['customer', 'seller', 'product', 'latestMessage.sender']) // Sử dụng 'customer' thay vì 'buyer'
            ->orderBy('last_message_at', 'desc')
            ->get();

        return Inertia::render('Chat/ChatIndex', [
            'conversations' => $conversations
        ]);
    }

    public function show(Conversation $conversation)
    {
        $user = auth()->user();

        if ($conversation->buyer_id !== $user->id && $conversation->seller_id !== $user->id) {
            abort(403);
        }

        $messages = $conversation->messages()->with('sender')->get();

        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return Inertia::render('Chat/ChatShow', [
            'conversation' => $conversation->load(['customer', 'seller', 'product']), // Sử dụng 'customer'
            'messages' => $messages
        ]);
    }

    public function store(Request $request, Conversation $conversation)
    {
        $request->validate([
            'message' => 'required|string|max:1000'
        ]);

        $user = auth()->user();

        if ($conversation->buyer_id !== $user->id && $conversation->seller_id !== $user->id) {
            abort(403);
        }

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'message' => $request->message,
            'type' => 'text',
        ]);

        $conversation->update(['last_message_at' => now()]);

        return response()->json([
            'message' => $message->load('sender')
        ]);
    }

    public function startConversation(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'message' => 'required|string|max:1000'
        ]);

        $user = auth()->user();
        $product = Product::findOrFail($request->product_id);

        if ($product->created_by === $user->id) {
            return response()->json(['error' => 'Không thể chat với chính mình'], 400);
        }

        $conversation = Conversation::firstOrCreate([
            'buyer_id' => $user->id, // buyer_id = customer_id
            'seller_id' => $product->created_by,
            'product_id' => $product->id,
        ], [
            'subject' => 'Về sản phẩm: ' . $product->name,
            'last_message_at' => now(),
        ]);

        $message = $conversation->messages()->create([
            'sender_id' => $user->id,
            'message' => $request->message,
            'type' => 'text',
        ]);

        return response()->json([
            'conversation_id' => $conversation->id,
        ]);
    }

    public function getMessages(Conversation $conversation)
    {
        $user = auth()->user();

        if ($conversation->buyer_id !== $user->id && $conversation->seller_id !== $user->id) {
            abort(403);
        }

        $messages = $conversation->messages()->with('sender')->get();

        $conversation->messages()
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        return response()->json([
            'messages' => $messages
        ]);
    }
}
