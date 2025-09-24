<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductTag>
 */
class ProductTagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tags = [
            'Mới ra mắt',
            'Bán chạy',
            'Giảm giá',
            'Cao cấp',
            'Tiết kiệm pin',
            'Gaming',
            'Văn phòng',
            'Mỏng nhẹ',
            'Chống nước',
            'Sạc nhanh',
            'Camera đẹp',
            'Pin trâu',
            'Màn hình lớn',
            'Đa nhiệm',
            'Học tập',
            'Doanh nhân',
            'Sinh viên',
            'Phụ kiện chính hãng',
            'Bảo hành dài',
            'Độc quyền'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($tags),
        ];
    }
}
