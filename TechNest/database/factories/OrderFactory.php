<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => 1, // Có thể truyền khi gọi factory trong seeder
            'total_amount' => $this->faker->numberBetween(1000000, 20000000),
            'discount' => 0,
            'shipping_fee' => 50000,
            'status' => 'pending',
        ];
    }
}
