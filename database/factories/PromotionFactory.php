<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Promotion>
 */
class PromotionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $promotions = [
            [
                'code' => 'LAPTOPSALE',
                'type' => 'percent',
                'value' => 10,
                'description' => 'Giảm 10% cho tất cả laptop',
            ],
            [
                'code' => 'PHONE50K',
                'type' => 'fixed',
                'value' => 50000,
                'description' => 'Giảm 50.000đ cho đơn hàng điện thoại',
            ],
            [
                'code' => 'FREESHIP',
                'type' => 'fixed',
                'value' => 30000,
                'description' => 'Miễn phí vận chuyển cho đơn hàng từ 500.000đ',
            ],
            [
                'code' => 'GIAMGIA5',
                'type' => 'percent',
                'value' => 5,
                'description' => 'Giảm 5% cho đơn hàng bất kỳ',
            ],
            [
                'code' => 'PHUKIEN20K',
                'type' => 'fixed',
                'value' => 20000,
                'description' => 'Giảm 20.000đ cho phụ kiện',
            ],
        ];

        $promo = $this->faker->unique()->randomElement($promotions);

        return [
            'code' => $promo['code'],
            'type' => $promo['type'],
            'value' => $promo['value'],
            'description' => $promo['description'],
            'min_order_amount' => $this->faker->randomElement([0, 200000, 500000, 1000000]),
            'usage_limit' => $this->faker->optional(70)->numberBetween(10, 100),
            'used_count' => $this->faker->numberBetween(0, 50),
            'starts_at' => $this->faker->optional(80)->dateTimeBetween('-1 month', 'now'),
            'expires_at' => $this->faker->optional(80)->dateTimeBetween('now', '+2 months'),
            'is_active' => $this->faker->boolean(90),
        ];
    }
}
