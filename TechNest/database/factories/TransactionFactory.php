<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payment;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'payment_id' => Payment::inRandomOrder()->first()?->id ?? Payment::factory(),
            'gateway' => $this->faker->randomElement(['VNPAY', 'MOMO', 'ZaloPay', 'PayPal']),
            'transaction_code' => $this->faker->unique()->regexify('[A-Z0-9]{12}'),
            'status' => $this->faker->randomElement(['success', 'failed', 'pending']),
            'amount' => $this->faker->numberBetween(10000, 5000000),
            'processed_at' => $this->faker->optional(80)->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
