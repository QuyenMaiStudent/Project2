<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackageRenewal extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_subscription_id',
        'status',
        'processed_at',
        'renewed_from',
        'renewed_to',
        'failure_reason',
        'metadata',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'renewed_from' => 'datetime',
        'renewed_to' => 'datetime',
        'metadata' => 'array',
    ];

    public function subscription()
    {
        return $this->belongsTo(PackageSubscription::class, 'package_subscription_id');
    }
}
