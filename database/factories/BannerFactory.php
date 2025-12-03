<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->optional()->sentence(3),
            'image_url' => $this->faker->imageUrl(1200, 400, 'business', true, 'Banner'),
            'link_url' => $this->faker->optional()->url(),
            'position' => $this->faker->randomElement(['homepage', 'sidebar', 'footer']),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
