<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Facades\Hash;

class Shipper extends Authenticatable
{
    use HasFactory;
    use Notifiable;

    protected $fillable = ['name', 'email', 'phone', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = ['email_verified_at' => 'datetime'];

    protected $guard = 'shipper';

    public function setPasswordAttribute(string $value): void
    {
        $this->attributes['password'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
    }
    
    // Thêm relationship
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    
    public function isAdmin(): bool { return false; }
    public function isSuperAdmin(): bool { return false; }
    public function isSeller(): bool { return false; }
    public function isCustomer(): bool { return false; }
}
