<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderStatusLog>
 */
class OrderStatusLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'order_id' => Order::inRandomOrder()->first()?->id ?? Order::factory(),
            'status' => $this->faker->randomElement(['placed', 'processing', 'shipped', 'delivered', 'cancelled']),
            'changed_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'note' => $this->faker->optional()->sentence(),
        ];
    }
}
