<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Wishlist;
use App\Models\Product;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WishlistItem>
 */
class WishlistItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'wishlist_id' => Wishlist::inRandomOrder()->first()?->id ?? Wishlist::factory(),
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
        ];
    }
}
