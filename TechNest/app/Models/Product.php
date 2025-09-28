<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'price', 'stock', 
        'brand_id', 'warranty_id', 'is_active', 'created_by', 'status' // Dùng created_by thay vì user_id
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'price' => 'decimal:2',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function warrantyPolicy()
    {
        return $this->belongsTo(WarrantyPolicy::class, 'warranty_id');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function specs()
    {
        return $this->hasMany(ProductSpec::class);
    }

    public function tags()
    {
        return $this->belongsToMany(ProductTag::class, 'product_tag_product');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class, 'product_category');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class); // Sửa lại từ ProductVersion thành Review
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function wishlistItems()
    {
        return $this->hasMany(WishlistItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function seller()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function canSubmitForApproval()
    {
        return 
            $this->images()->count() > 0 &&
            $this->specs()->count() > 0 &&
            $this->variants()->count() > 0;
    }
}
