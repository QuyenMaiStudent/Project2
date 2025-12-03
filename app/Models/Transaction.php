<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = ['payment_id', 'gateway', 'transaction_code', 'status', 'amount', 'processed_at'];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
