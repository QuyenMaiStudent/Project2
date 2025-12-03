<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdministrativeUnit extends Model
{
    protected $primaryKey = 'id';

    protected $fillable = [
        'full_name',
        'full_name_en',
        'short_name',
        'short_name_en',
        'code_name',
        'code_name_en',
    ];

    public function provinces()
    {
        return $this->hasMany(Province::class, 'administrative_unit_id');
    }

    public function wards()
    {
        return $this->hasMany(Ward::class, 'administrative_unit_id');
    }

}
