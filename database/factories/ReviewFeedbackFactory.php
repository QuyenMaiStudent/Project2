<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReviewFeedback>
 */
class ReviewFeedbackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'review_id' => Review::inRandomOrder()->first()?->id ?? Review::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'type' => $this->faker->randomElement(['like', 'dislike']),
        ];
    }
}
