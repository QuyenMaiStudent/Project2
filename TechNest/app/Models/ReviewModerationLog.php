<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewModerationLog extends Model
{
    use HasFactory;

    protected $fillable = ['review_id', 'moderator_id', 'action', 'note'];

    public function review()
    {
        return $this->belongsTo(Review::class);
    }

    public function moderator()
    {
        return $this->belongsTo(User::class, 'moderator_id');
    }
}
