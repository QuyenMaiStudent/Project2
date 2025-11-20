<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model
{
    use HasFactory;
    protected $table = 'shipping_addresses_v2';

    protected $fillable = [
        'user_id',
        'recipient_name',
        'phone',
        'address_line',
        'province_code',   // đổi từ province_id sang province_code
        'ward_code',       // đổi từ ward_id sang ward_code
        'latitude',
        'longitude',
        'is_default'
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function province()
    {
        // province_code (local) -> code (remote)
        return $this->belongsTo(Province::class, 'province_code', 'code');
    }

    public function ward()
    {
        // ward_code (local) -> code (remote)
        return $this->belongsTo(Ward::class, 'ward_code', 'code');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}