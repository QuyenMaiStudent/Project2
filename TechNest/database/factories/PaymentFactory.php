<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Order;
use App\Models\PaymentMethod;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Payment>
 */
class PaymentFactory extends Factory
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
            'payment_method_id' => PaymentMethod::inRandomOrder()->first()?->id ?? PaymentMethod::factory(),
            'status' => $this->faker->randomElement(['pending', 'paid', 'failed', 'refunded']),
            'amount' => $this->faker->numberBetween(100000, 5000000),
            'transaction_code' => $this->faker->optional()->regexify('[A-Z0-9]{12}'),
            'paid_at' => $this->faker->optional(60)->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
