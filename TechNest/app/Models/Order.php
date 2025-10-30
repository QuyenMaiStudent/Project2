<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    // Thêm constants cho status
    const STATUS_DRAFT = 'draft';
    const STATUS_PLACED = 'placed';
    const STATUS_PROCESSING = 'processing';
    const STATUS_PAID = 'paid';
    const STATUS_SHIPPED = 'shipped';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    protected $fillable = [
        'user_id',
        'status',
        'total_amount',
        'discount_amount',
        'promotion_id',
        'shipping_address_id',
        'placed_at'
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'placed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class);
    }

    public function shippingTracking()
    {
        return $this->hasOne(ShippingTracking::class);
    }

    public function shippingAddress()
    {
        return $this->belongsTo(ShippingAddress::class);
    }

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }

    public function promotion()
    {
        return $this->belongsTo(Promotion::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'payment_id', 'id')
                   ->join('payments', 'transactions.payment_id', '=', 'payments.id')
                   ->where('payments.order_id', $this->id);
    }
}
