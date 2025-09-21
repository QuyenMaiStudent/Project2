<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = ['order_id', 'payment_method_id', 'status', 'amount', 'transaction_code', 'paid_at'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function method()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
