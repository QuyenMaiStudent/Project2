<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WarrantyPolicy extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'content', 'duration_months'];
}
