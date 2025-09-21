<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'price', 'stock', 
        'brand_id', 'warranty_id', 'is_active'
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function warrantyPolicy()
    {
        return $this->belongsTo(WarrantyPolicy::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
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
        return $this->hasMany(ProductVersion::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
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
}
