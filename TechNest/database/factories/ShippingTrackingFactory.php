<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingTracking>
 */
class ShippingTrackingFactory extends Factory
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
            'tracking_number' => $this->faker->unique()->regexify('[A-Z0-9]{10}'),
            'carrier' => $this->faker->randomElement(['VNPost', 'Viettel', 'GHTK', 'J&T', 'Ninja Van']),
            'status' => $this->faker->randomElement(['pending', 'in_transit', 'delivered', 'failed']),
        ];
    }
}
