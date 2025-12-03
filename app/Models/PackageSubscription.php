<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

use function Symfony\Component\Clock\now;

class PackageSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'user_id',
        'status',
        'auto_renew',
        'price',
        'started_at',
        'expires_at',
        'last_renewed_at',
        'next_renewal_at',
        'cancelled_at',
        'metadata',
    ];

    protected $casts = [
        'auto_renew' => 'boolean',
        'metadata' => 'array',
        'started_at' => 'datetime',
        'expires_at' => 'datetime',
        'last_renewed_at' => 'datetime',
        'next_renewal_at' => 'datetime',
        'cancelled_at' => 'datetime',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function renewals(): HasMany
    {
        return $this->hasMany(PackageRenewal::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active')->where('expires_at', '>', now());
    }

    public function scopeDueForRenewal($query)
    {
        return $query->where('auto_renew', true)
                     ->where('status', 'active')
                     ->whereNotNull('expires_at')
                     ->where('next_renewal_at', '<=', now());
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->expires_at instanceof Carbon && $this->expires_at->isFuture();
    }
}
