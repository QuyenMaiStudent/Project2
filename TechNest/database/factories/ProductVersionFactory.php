<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVersion>
 */
class ProductVersionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $changesList = [
            'Khắc phục lỗi hiển thị giao diện.',
            'Tối ưu hóa hiệu suất sử dụng pin.',
            'Cải thiện tốc độ mở ứng dụng.',
            'Sửa lỗi kết nối Bluetooth.',
            'Cập nhật bản vá bảo mật mới nhất.',
            'Tối ưu hóa camera khi chụp thiếu sáng.',
            'Sửa lỗi không nhận sạc nhanh.',
            'Cải thiện độ nhạy cảm ứng màn hình.',
            'Tối ưu hóa hệ thống làm mát.',
            'Sửa lỗi nhỏ về âm thanh.',
            'Cập nhật giao diện người dùng.',
            'Tối ưu hóa khả năng nhận diện vân tay.',
            'Khắc phục lỗi thông báo không hiển thị.',
            'Cải thiện khả năng bắt sóng Wi-Fi.',
            'Sửa lỗi đồng bộ dữ liệu với đám mây.'
        ];

        return [
            'product_id' => Product::inRandomOrder()->first()?->id ?? Product::factory(),
            'version_name' => $this->faker->randomElement(['v1.0', 'v1.1', 'v2.0', 'v2.1']),
            'changes' => $this->faker->randomElement($changesList),
        ];
    }
}
