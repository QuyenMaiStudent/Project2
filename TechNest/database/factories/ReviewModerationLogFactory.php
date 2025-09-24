<?php

namespace Database\Factories;

use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReviewModerationLog>
 */
class ReviewModerationLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = [
            'approved' => [
                'note' => [
                    'Nội dung đánh giá phù hợp, đã duyệt.',
                    'Đánh giá hợp lệ, không vi phạm quy định.',
                    'Đánh giá tích cực, không có dấu hiệu spam.',
                    'Đánh giá rõ ràng, không chứa từ ngữ nhạy cảm.',
                ]
            ],
            'rejected' => [
                'note' => [
                    'Nội dung đánh giá không phù hợp.',
                    'Đánh giá chứa từ ngữ không hợp lệ.',
                    'Đánh giá bị trùng lặp hoặc spam.',
                    'Đánh giá không liên quan đến sản phẩm.',
                    'Đánh giá có dấu hiệu quảng cáo.',
                ]
            ]
        ];

        $action = $this->faker->randomElement(['approved', 'rejected']);
        $note = $this->faker->randomElement($actions[$action]['note']);

        return [
            'review_id' => Review::inRandomOrder()->first()?->id ?? Review::factory(),
            'moderator_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'action' => $action,
            'note' => $note,
        ];
    }
}
