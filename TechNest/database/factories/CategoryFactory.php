<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Laptop',
            'Điện thoại',
            'Máy tính bảng',
            'Tai nghe',
            'Chuột máy tính',
            'Bàn phím',
            'Màn hình',
            'Ổ cứng di động',
            'Pin dự phòng',
            'Cáp sạc',
            'Loa Bluetooth',
            'Webcam',
            'Balo laptop',
            'Miếng dán màn hình',
            'Ốp lưng điện thoại',
            'Sạc nhanh',
            'Hub chuyển đổi',
            'Thẻ nhớ',
            'USB',
            'Router WiFi',
            'Phụ kiện khác'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($categories),
            'description' => $this->faker->sentence(),
            'parent_id' => null, // Sẽ gán trong seeder nếu cần
        ];
    }
}
