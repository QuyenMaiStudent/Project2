<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductSpec>
 */
class ProductSpecFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $specs = [
            // Laptop
            ['key' => 'CPU', 'value' => $this->faker->randomElement(['Intel Core i5', 'Intel Core i7', 'AMD Ryzen 5', 'Apple M1'])],
            ['key' => 'RAM', 'value' => $this->faker->randomElement(['8GB', '16GB', '32GB'])],
            ['key' => 'Ổ cứng', 'value' => $this->faker->randomElement(['256GB SSD', '512GB SSD', '1TB SSD'])],
            ['key' => 'Card đồ họa', 'value' => $this->faker->randomElement(['Intel Iris Xe', 'NVIDIA RTX 3050', 'AMD Radeon'])],
            ['key' => 'Màn hình', 'value' => $this->faker->randomElement(['14 inch FHD', '15.6 inch FHD', '13.3 inch Retina'])],
            ['key' => 'Trọng lượng', 'value' => $this->faker->randomElement(['1.2kg', '1.5kg', '2kg'])],
            ['key' => 'Pin', 'value' => $this->faker->randomElement(['56Wh', '70Wh', '90Wh'])],
            // Điện thoại
            ['key' => 'Màn hình', 'value' => $this->faker->randomElement(['6.1 inch OLED', '6.7 inch AMOLED', '5.8 inch LCD'])],
            ['key' => 'Camera', 'value' => $this->faker->randomElement(['12MP', '48MP', '108MP'])],
            ['key' => 'Dung lượng pin', 'value' => $this->faker->randomElement(['4000mAh', '4500mAh', '5000mAh'])],
            ['key' => 'Bộ nhớ trong', 'value' => $this->faker->randomElement(['64GB', '128GB', '256GB', '512GB'])],
            ['key' => 'RAM', 'value' => $this->faker->randomElement(['4GB', '6GB', '8GB', '12GB'])],
            ['key' => 'Chip xử lý', 'value' => $this->faker->randomElement(['Snapdragon 8 Gen 1', 'Apple A15', 'Exynos 2100'])],
            ['key' => 'Hệ điều hành', 'value' => $this->faker->randomElement(['Android 13', 'iOS 17'])],
            ['key' => 'Kết nối', 'value' => $this->faker->randomElement(['5G', '4G LTE', 'Wi-Fi 6'])],
            ['key' => 'Kháng nước', 'value' => $this->faker->randomElement(['IP67', 'IP68', 'Không hỗ trợ'])],
        ];

        $spec = $this->faker->randomElement($specs);

        return [
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            'key' => $spec['key'],
            'value' => $spec['value'],
        ];
    }
}
