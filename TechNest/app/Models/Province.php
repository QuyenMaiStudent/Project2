<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Province extends Model
{
    protected $primaryKey = 'code'; // vì bạn dùng code làm khóa chính
    public $incrementing = false;   // vì code không phải kiểu số tự tăng
    protected $keyType = 'string';  // vì code là varchar

    protected $fillable = [
        'code',
        'name',
        'name_en',
        'full_name',
        'full_name_en',
        'code_name',
        'administrative_unit_id',
    ];

    // Quan hệ với administrative unit
    public function administrativeUnit()
    {
        return $this->belongsTo(AdministrativeUnit::class, 'administrative_unit_id');
    }

    // Quan hệ với wards
    public function wards()
    {
        return $this->hasMany(Ward::class, 'province_code', 'code');
    }

}
