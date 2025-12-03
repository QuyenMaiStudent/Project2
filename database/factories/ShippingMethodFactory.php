<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingMethod>
 */
class ShippingMethodFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->randomElement(['Giao hàng nhanh', 'Giao hàng tiết kiệm', 'Viettel Post', 'GrabExpress']),
            'base_fee' => $this->faker->randomFloat(2, 15000, 100000),
            'description' => $this->faker->sentence(),
        ];
    }
}
