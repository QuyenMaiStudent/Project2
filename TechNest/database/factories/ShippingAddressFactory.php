<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Province;
use App\Models\Ward;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ShippingAddress>
 */
class ShippingAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'recipient_name' => $this->faker->name(),
            'phone' => $this->faker->phoneNumber(),
            'address_line' => $this->faker->streetAddress(),
            'province_id' => Province::inRandomOrder()->first()?->id ?? Province::factory(),
            'ward_id' => Ward::inRandomOrder()->first()?->id ?? Ward::factory(),
            'is_default' => $this->faker->boolean(20),
        ];
    }
}
