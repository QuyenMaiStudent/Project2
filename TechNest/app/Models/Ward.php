<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'code', 'district_id'];

    public function district()
    {
        return $this->belongsTo(District::class);
    }

    public function userAddresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function shippingAddresses()
    {
        return $this->hasMany(ShippingAddress::class);
    }
}
