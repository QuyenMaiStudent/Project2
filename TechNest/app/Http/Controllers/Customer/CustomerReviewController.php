<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;

class CustomerReviewController extends Controller
{
    public function canReview(Product $product)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['eligible' => false, 'message' => 'Unauthorized'], 401);
        }

        // sửa: kiểm tra review của chính user này cho sản phẩm
        $already = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->exists();
        if ($already) {
            return response()->json(['eligible' => false, 'message' => 'Bạn đã đánh giá sản phẩm này.']);
        }

        $hasDelivered = Order::where('user_id', $user->id)
            ->where('status', Order::STATUS_DELIVERED)
            ->whereHas('items', function ($q) use ($product) {
                $q->where('product_id', $product->id);
            })->exists();

        if (! $hasDelivered) {
            return response()->json(['eligible' => false, 'message' => 'Chỉ những đơn hàng đã nhận mới có thể đánh giá sản phẩm.']);
        }

        return response()->json(['eligible' => true]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'rating' => 'required|integer|min:1|max:5',
            'content' => 'nullable|string|max:5000',
        ]);

        // Không cho phép đánh giá lại
        $exists = Review::where('user_id', $user->id)->where('product_id', $data['product_id'])->exists();
        if ($exists) {
            return response()->json(['success' => false, 'message' => 'Bạn đã đánh giá sản phẩm này.'], 422);
        }

        $hasDelivered = Order::where('user_id', $user->id)
            ->where('status', Order::STATUS_DELIVERED)
            ->whereHas('items', function ($q) use ($data) {
                $q->where('product_id', $data['product_id']);
            })->exists();

        if (! $hasDelivered) {
            return response()->json(['success' => false, 'message' => 'Bạn không đủ điều kiện để đánh giá sản phẩm này.']);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'product_id' => $data['product_id'],
            'rating' => $data['rating'],
            'content' => $data['content'] ?? '',
            'status' => 'published',
        ]);

        // trả về review đã tạo để frontend có thể cập nhật ngay
        return response()->json(['success' => true, 'message' => 'Cảm ơn bạn đã đánh giá sản phẩm.', 'review' => $review], 201);
    }

    public function index(Product $product)
    {
        $reviews = Review::with('user:id,name')
            ->where('product_id', $product->id)
            ->where('status', 'published')
            ->latest()
            ->get()
            ->map(fn ($review) => [
                'id' => $review->id,
                'user_name' => optional($review->user)->name,
                'rating' => $review->rating,
                'content' => $review->content,
                'created_at' => optional($review->created_at)->toIso8601String(),
            ]);

        return response()->json($reviews);
    }
}
