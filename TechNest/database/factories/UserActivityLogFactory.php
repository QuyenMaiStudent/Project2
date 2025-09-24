<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\UserActivityLog>
 */
class UserActivityLogFactory extends Factory
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
            'action' => $this->faker->randomElement(['login', 'logout', 'update_profile', 'change_password']),
            'description' => $this->faker->sentence(),
            'ip_address' => $this->faker->ipv4(),
        ];
    }
}
