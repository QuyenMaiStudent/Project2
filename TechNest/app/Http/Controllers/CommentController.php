<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function index($productId)
    {
        $comments = Comment::query()
            ->where('product_id', $productId)
            ->whereNull('parent_id')
            ->withCount(['likedUsers as likes_count'])
            ->with([
                'user:id,name',
                'replies.user:id,name',
                'replies.replies.user:id,name',
                'replies.likedUsers',
                'replies.replies.likedUsers'
            ])
            ->orderByRaw("FIELD(status, 'pinned') DESC")
            ->orderBy('created_at', 'desc')
            ->get();

        // Nếu không phải admin, lọc bỏ comment bị ẩn
        if (!Auth::user()?->is_admin) {
            $comments = $comments->filter(fn($c) => in_array($c->status, ['published', 'pinned']));
        }

        // Gắn fallback tên người dùng
        $comments->transform(function ($comment) {
            $comment->user_name = $comment->user->name ?? 'Người dùng ẩn';
            $comment->replies->transform(function ($reply) {
                $reply->user_name = $reply->user->name ?? 'Người dùng ẩn';
                $reply->replies->transform(function ($subReply) {
                    $subReply->user_name = $subReply->user->name ?? 'Người dùng ẩn';
                    return $subReply;
                });
                return $reply;
            });
            return $comment;
        });

        return response()->json($comments->values());
    }

    public function store(Request $request, $productId)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        $request->validate([
            'content' => 'required|string|max:2000',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $comment = Comment::create([
            'user_id' => Auth::id(),
            'product_id' => $productId,
            'parent_id' => $request->parent_id,
            'content' => $request->content,
            'status' => 'published'
        ]);

        $comment->load('user:id,name');
        $comment->user_name = $comment->user->name ?? 'Người dùng ẩn';

        return response()->json([
            'message' => 'Đã thêm bình luận',
            'comment' => $comment
        ]);
    }

    public function show($id)
    {
        $comment = Comment::with([
                'user:id,name',
                'replies.user:id,name',
                'replies.replies.user:id,name',
                'likedUsers',
                'replies.likedUsers',
                'replies.replies.likedUsers'
            ])
            ->withCount(['likedUsers as likes_count'])
            ->findOrFail($id);

        $comment->user_name = $comment->user->name ?? 'Người dùng ẩn';
        $comment->replies->transform(function ($reply) {
            $reply->user_name = $reply->user->name ?? 'Người dùng ẩn';
            $reply->replies->transform(function ($subReply) {
                $subReply->user_name = $subReply->user->name ?? 'Người dùng ẩn';
                return $subReply;
            });
            return $reply;
        });

        return response()->json($comment);
    }

    public function update(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền chỉnh sửa'], 403);
        }

        $request->validate([
            'content' => 'required|string|max:2000'
        ]);

        $comment->update(['content' => $request->content]);

        return response()->json(['message' => 'Đã cập nhật bình luận', 'comment' => $comment]);
    }

    public function destroy($id)
    {
        $comment = Comment::findOrFail($id);

        if ($comment->user_id !== Auth::id()) {
            return response()->json(['message' => 'Không có quyền xoá'], 403);
        }

        $comment->delete();
        return response()->json(['message' => 'Đã xoá bình luận']);
    }

    public function report($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        $comment = Comment::findOrFail($id);

        $alreadyReported = $comment->reports()->where('user_id', Auth::id())->exists();
        if ($alreadyReported) {
            return response()->json(['message' => 'Bạn đã báo cáo bình luận này']);
        }

        $comment->reports()->create(['user_id' => Auth::id()]);

        return response()->json(['message' => 'Đã báo cáo vi phạm bình luận #' . $comment->id]);
    }

    public function like($id)
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Chưa đăng nhập'], 401);
        }

        $comment = Comment::findOrFail($id);
        $user = Auth::user();

        if ($comment->likedUsers()->where('user_id', $user->id)->exists()) {
            $comment->likedUsers()->detach($user->id);
            $message = 'Đã bỏ thích bình luận #' . $comment->id;
        } else {
            $comment->likedUsers()->attach($user->id);
            $message = 'Đã thích bình luận #' . $comment->id;
        }

        $likesCount = $comment->likedUsers()->count();

        return response()->json([
            'message' => $message,
            'likes_count' => $likesCount
        ]);
    }

    public function pin($id)
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Chỉ admin mới có thể ghim'], 403);
        }

        $comment = Comment::findOrFail($id);
        $comment->update(['status' => 'pinned']);

        return response()->json(['message' => 'Đã ghim bình luận #' . $comment->id]);
    }

    public function hide($id)
    {
        if (!Auth::check() || !Auth::user()->is_admin) {
            return response()->json(['message' => 'Chỉ admin mới có thể ẩn'], 403);
        }

        $comment = Comment::findOrFail($id);
        $comment->update(['status' => 'hidden']);

        return response()->json(['message' => 'Đã ẩn bình luận #' . $comment->id]);
    }
}
