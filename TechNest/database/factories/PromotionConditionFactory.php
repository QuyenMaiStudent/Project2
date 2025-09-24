<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Promotion;
use App\Models\Category;
use App\Models\Product;
use App\Models\Brand;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PromotionCondition>
 */
class PromotionConditionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = $this->faker->randomElement(['category', 'product', 'brand']);

        // Lấy id thực tế, không tạo mới nếu không có dữ liệu
        $targetId = null;
        if ($type === 'category') {
            $targetId = Category::inRandomOrder()->value('id');
        } elseif ($type === 'product') {
            $targetId = Product::inRandomOrder()->value('id');
        } else {
            $targetId = Brand::inRandomOrder()->value('id');
        }

        // Nếu chưa có dữ liệu, có thể bỏ qua hoặc tạo dữ liệu mẫu trước khi seed PromotionCondition

        return [
            'promotion_id' => Promotion::inRandomOrder()->value('id'),
            'condition_type' => $type,
            'target_id' => $targetId,
        ];
    }
}
