<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PackagePaymentTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'package_payment_id',
        'gateway',
        'status',
        'type',
        'transaction_code',
        'amount',
        'processed_at',
        'payload',
    ];

    protected $casts = [
        'processed_at' => 'datetime',
        'payload' => 'array',
        'amount' => 'decimal:2',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(PackagePayment::class, 'package_payment_id');
    }
}