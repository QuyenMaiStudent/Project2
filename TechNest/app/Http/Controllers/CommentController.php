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

        // hotfix: avoid referencing comment_likes until migration exists
        $query = Comment::where('product_id', $productId)
            ->whereNull('parent_id')
            ->where(function($q){
                $q->where('status', 'published')->orWhere('pinned', 1);
            })
            ->orderByDesc('pinned')
            ->orderByDesc('created_at');

        $total = $query->count();
        $comments = $query->skip($offset)->take($limit)->get(['id','user_id','content','created_at','replies_count','likes_count']);

        // load relations manually (user + replies) if needed
        $comments->load('user:id,name');

        // Add user_name for easier frontend handling
        $comments->each(function($comment) {
            $comment->user_name = $comment->user->name ?? 'Người dùng ẩn';
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

    // ... phần còn lại giữ nguyên ...
}