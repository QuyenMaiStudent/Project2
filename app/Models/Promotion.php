<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    use HasFactory;

    protected $fillable = [
        'code', 'type', 'value', 'min_order_amount', 'usage_limit',
        'used_count', 'starts_at', 'expires_at', 'is_active',
        'seller_id', 'description',
    ];

    protected $casts = [
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'promotion_usages')->withPivot('used_times');
    }

    public function conditions()
    {
        return $this->hasMany(PromotionCondition::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
