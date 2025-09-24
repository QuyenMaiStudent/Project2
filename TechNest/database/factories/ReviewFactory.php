<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Review>
 */
class ReviewFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reviewContents = [
            'Sản phẩm rất tốt, đúng như mô tả. Giao hàng nhanh.',
            'Chất lượng ổn, giá hợp lý. Sẽ ủng hộ lần sau.',
            'Đóng gói cẩn thận, nhân viên tư vấn nhiệt tình.',
            'Sản phẩm hoạt động mượt mà, pin dùng lâu.',
            'Màu sắc đẹp, thiết kế sang trọng, rất hài lòng.',
            'Giao hàng hơi chậm nhưng sản phẩm không bị lỗi.',
            'Sản phẩm không đúng như mong đợi, cần cải thiện.',
            'Hàng bị lỗi nhẹ nhưng shop hỗ trợ đổi trả nhanh.',
            'Rất hài lòng với dịch vụ và chất lượng sản phẩm.',
            'Sản phẩm tốt nhưng giá hơi cao so với thị trường.',
        ];

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            'rating' => $this->faker->numberBetween(1, 5),
            'content' => $this->faker->randomElement($reviewContents),
            'status' => $this->faker->randomElement(['pending', 'published', 'rejected']),
        ];
    }
}
