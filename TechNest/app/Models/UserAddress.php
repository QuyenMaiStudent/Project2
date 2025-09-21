<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'recipient_name', 'phone', 'address_line',
        'ward_id', 'district_id', 'province_id', 'is_default'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ward()
    {
        return $this->belongsTo(Ward::class);
    }

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function province()
    {
        return $this->belongsTo(Province::class);
    }
}
