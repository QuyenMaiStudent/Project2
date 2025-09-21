<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'seller_id' => 1, // Có thể truyền khi gọi factory trong seeder
            'category_id' => 1, // Có thể truyền khi gọi factory trong seeder
            'brand_id' => 1, // Có thể truyền khi gọi factory trong seeder
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(1000000, 20000000),
            'stock_quantity' => $this->faker->numberBetween(1, 100),
            'status' => 'active',
        ];
    }
}
