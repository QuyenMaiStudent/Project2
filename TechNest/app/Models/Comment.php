<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'product_id', 'parent_id',
        'content', 'status', 'pinned',
        'likes_count', 'replies_count', 'edited_at'
    ];

    protected $casts = [
        'pinned' => 'boolean',
        'likes_count' => 'integer',
        'replies_count' => 'integer',
        'edited_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->orderBy('created_at', 'asc');
    }

    public function likedUsers()
    {
        return $this->belongsToMany(User::class, 'comment_likes')->withTimestamps();
    }

    public function reports()
    {
        return $this->hasMany(CommentReport::class);
    }
}
