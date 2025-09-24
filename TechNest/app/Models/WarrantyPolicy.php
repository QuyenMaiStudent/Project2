<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarrantyPolicy extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'duration_months'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
