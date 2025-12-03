<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // 'order_id' => Order::inRandomOrder()->first()?->id ?? Order::factory(),
            // 'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            // 'product_variant_id' => ProductVariant::inRandomOrder()->first()?->id ?? null,
            // 'quantity' => $this->faker->numberBetween(1, 5),
            // 'price' => $this->faker->numberBetween(100000, 5000000),
        ];
    }
}
