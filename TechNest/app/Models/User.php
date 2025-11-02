<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_role');
    }

    public function profile()
    {
        return $this->hasOne(UserProfile::class);
    }

    public function addresses()
    {
        return $this->hasMany(UserAddress::class);
    }

    public function activityLogs()
    {
        return $this->hasMany(UserActivityLog::class);
    }

    public function settings()
    {
        return $this->hasOne(UserSetting::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function reviewFeedbacks()
    {
        return $this->hasMany(ReviewFeedback::class);
    }

    public function reviewModerationLogs()
    {
        return $this->hasMany(ReviewModerationLog::class, 'moderator_id');
    }

    public function cart()
    {
        return $this->hasOne(Cart::class);
    }

    public function wishlist()
    {
        return $this->hasOne(Wishlist::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function shippingAddresses()
    {
        return $this->hasMany(ShippingAddress::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }

    public function promotions()
    {
        return $this->belongsToMany(Promotion::class, 'promotion_usages')->withPivot('used_times');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function supportTickets()
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function assignedTickets()
    {
        return $this->hasMany(SupportTicket::class, 'assigned_to');
    }

    public function supportTicketReplies()
    {
        return $this->hasMany(SupportTicketReply::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Thêm các relationship cho chat
    public function customerConversations()
    {
        return $this->hasMany(Conversation::class, 'buyer_id'); // buyer_id thực chất là customer_id
    }

    public function buyerConversations()
    {
        return $this->hasMany(Conversation::class, 'buyer_id');
    }

    public function sellerConversations()
    {
        return $this->hasMany(Conversation::class, 'seller_id');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    // Relationship cho products (seller)
    public function products()
    {
        return $this->hasMany(Product::class, 'created_by');
    }

    public function isSeller()
    {
        if ($this->role && $this->role->name === 'seller') {
            return true;
        }

        return $this->roles()->where('name', 'seller')->exists();
    }

    public function isAdmin()
    {
        if ($this->role && $this->role->name === 'admin') {
            return true;
        }

        return $this->roles()->where('name', 'admin')->exists();
    }

    public function isSuperAdmin()
    {
        if ($this->role && $this->role->name === 'superadmin') {
            return true;
        }
        return $this->roles()->where('name', 'superadmin')->exists();
    }

    public function isCustomer()
    {
        if ($this->role && $this->role->name === 'customer') {
            return true;
        }
        return $this->roles()->where('name', 'customer')->exists();
    }

    public function hasRole($roleName)
    {
        if ($this->role && $this->role->name === $roleName) {
            return true;
        }
        return $this->roles()->where('name', $roleName)->exists();
    }

    public function sellerPromotions()
    {
        return $this->hasMany(Promotion::class, 'seller_id');
    }
}
