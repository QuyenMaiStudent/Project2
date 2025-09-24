<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

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
            // 'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'status' => $this->faker->randomElement(['draft', 'placed', 'processing', 'shipped', 'delivered', 'cancelled']),
            'total_amount' => 0,
            'placed_at' => $this->faker->optional(80)->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
