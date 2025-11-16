<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackagePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_id',
        'user_id',
        'gateway',
        'status',
        'amount',
        'currency',
        'exchange_rate',
        'reference',
        'external_id',
        'transaction_code',
        'metadata',
        'raw_response',
        'return_url',
        'cancel_url',
        'paid_at',
    ];

    protected $casts = [
        'metadata' => 'array',
        'raw_response' => 'array',
        'paid_at' => 'datetime',
        'exchange_rate' => 'decimal:6',
    ];

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PackagePaymentTransaction::class);
    }

    public function markSucceeded(?string $transactionCode, array $payload = []): void
    {
        if ($this->status === 'succeeded') {
            return;
        }

        $this->update([
            'status' => 'succeeded',
            'transaction_code' => $transactionCode,
            'raw_response' => $payload,
            'paid_at' => now(),
        ]);
    }

    public function markFailed(string $status, array $payload = []): void
    {
        $this->update([
            'status' => $status,
            'raw_response' => $payload,
        ]);
    }
}