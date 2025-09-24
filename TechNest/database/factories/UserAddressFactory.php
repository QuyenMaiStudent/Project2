<?php

namespace Database\Factories;

use App\Models\District;
use App\Models\Province;
use App\Models\User;
use App\Models\Ward;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserAddress>
 */
class UserAddressFactory extends Factory
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
            'ward_id' => Ward::inRandomOrder()->first()?->id ?? Ward::factory(),
            'district_id' => District::inRandomOrder()->first()?->id ?? District::factory(),
            'province_id' => District::inRandomOrder()->first()?->province_id ?? Province::factory(),
            'is_default' => $this->faker->boolean(20),
        ];
    }
}
