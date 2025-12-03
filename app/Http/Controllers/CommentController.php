<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    // GET /comments/{productId}?limit=3&offset=0
    public function index(Request $request, $productId)
    {
        $limit = intval($request->query('limit', 3));
        $offset = intval($request->query('offset', 0));

        $product = Product::findOrFail($productId);

        $query = Comment::where('product_id', $productId)
            ->whereNull('parent_id')
            ->where(function($q){
                $q->where('status', 'published')->orWhere('pinned', 1);
            })
            ->orderByDesc('pinned')
            ->orderByDesc('created_at');

        $total = $query->count();
        $comments = $query->skip($offset)->take($limit)->get(['id','user_id','content','created_at','replies_count','likes_count']);

        // Load user và replies với replies' user
        $comments->load([
            'user:id,name',
            'replies' => function($q) {
                $q->where('status', 'published')
                  ->orderBy('created_at', 'asc')
                  ->with('user:id,name');
            }
        ]);

        // Add user_name và is_product_seller for easier frontend handling
        $comments->each(function($comment) use ($product) {
            $comment->user_name = $comment->user->name ?? 'Người dùng ẩn';
            $comment->is_product_seller = $comment->user_id === $product->created_by;
            
            // Add user_name và is_product_seller for replies too
            if ($comment->replies) {
                $comment->replies->each(function($reply) use ($product) {
                    $reply->user_name = $reply->user->name ?? 'Người dùng ẩn';
                    $reply->is_product_seller = $reply->user_id === $product->created_by;
                });
            }
        });

        return response()->json([
            'total' => $total,
            'comments' => $comments,
        ]);
    }

    // POST /comments/{productId}
    public function store(Request $request, $productId)
    {
        Log::info('Comment store request', [
            'user_id' => Auth::id(),
            'product_id' => $productId,
            'content' => $request->input('content'),
            'parent_id' => $request->input('parent_id'),
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        try {
            $validated = $request->validate([
                'content' => 'required|string|max:2000',
                'parent_id' => 'nullable|exists:comments,id'
            ]);

            // Verify product exists
            $product = Product::findOrFail($productId);

            if ($request->parent_id) {
                $parent = Comment::find($request->parent_id);
                if (!$parent || $parent->product_id != $productId) {
                    return response()->json(['message' => 'Parent comment không hợp lệ cho sản phẩm này'], 422);
                }
            }

            $comment = Comment::create([
                'user_id' => Auth::id(),
                'product_id' => $productId,
                'parent_id' => $request->parent_id,
                'content' => $validated['content'],
                'status' => 'published'
            ]);

            // nếu là reply, tăng replies_count của parent
            if ($request->parent_id) {
                Comment::where('id', $request->parent_id)->increment('replies_count');
            }

            $comment->load('user:id,name');
            $comment->user_name = $comment->user->name ?? 'Người dùng ẩn';

            Log::info('Comment created successfully', ['comment_id' => $comment->id]);

            return response()->json([
                'message' => 'Đã thêm bình luận',
                'comment' => $comment
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Comment validation failed', ['errors' => $e->errors()]);
            return response()->json([
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Comment creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra khi tạo bình luận'], 500);
        }
    }

    // POST /comments/{commentId}/like
    public function like(Request $request, $commentId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => "Chưa đăng nhập"], 401);
        }

        try {
            $comment = Comment::findOrFail($commentId);

            // Check if already liked
            $existingLike = $comment->likedUsers()->where('user_id', Auth::id())->exists();

            if ($existingLike) {
                // Unlike
                $comment->likedUsers()->detach(Auth::id());
                $comment->decrement('likes_count');

                return response()->json([
                    'message' => 'Đã bỏ thích',
                    'liked' => false,
                    'likes_count' => $comment->likes_count
                ]);
            } else {
                // Like - Sửa lỗi: phải là attach, không phải detach
                $comment->likedUsers()->attach(Auth::id());
                $comment->increment('likes_count');

                return response()->json([
                    'message' => 'Đã thích',
                    'liked' => true,
                    'likes_count' => $comment->likes_count
                ]);
            }
        } catch (\Exception $e) {
            Log::error('Like comment failed', [
                'error' => $e->getMessage(),
                'comment_id' => $commentId,
            ]);
            return response()->json(['message' => 'Có lỗi xảy ra'], 500);
        }
    }

    // GET /comments/{commentId}/check-likes
    public function checkLike(Request $request, $commentId)
    {
        if (!Auth::check()) {
            return response()->json(['liked' => false, 'likes_count' => 0]);
        }

        try {
            $comment = Comment::findOrFail($commentId);
            $liked = $comment->likedUsers()->where('user_id', Auth::id())->exists();

            return response()->json([
                'liked' => $liked,
                'likes_count' => $comment->likes_count
            ]);
        } catch (\Exception $e) {
            return response()->json(['liked' => false, 'likes_count' => 0]);
        }
    }
}