<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\WarrantyPolicy;
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
            'name' => $this->faker->unique()->word(),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(100000, 20000000),
            'stock' => $this->faker->numberBetween(10, 100),
            'brand_id' => Brand::inRandomOrder()->first()?->id ?? Brand::factory(),
            'warranty_id' => WarrantyPolicy::inRandomOrder()->first()?->id ?? WarrantyPolicy::factory(),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
