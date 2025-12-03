<?php

namespace Database\Factories;

use App\Models\Province;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\District>
 */
class DistrictFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $districts = [
            'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
            'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình', 'Quận Tân Phú',
            'Quận Thủ Đức', 'Huyện Bình Chánh', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Nhà Bè', 'Huyện Cần Giờ',
            'Quận Ba Đình', 'Quận Hoàn Kiếm', 'Quận Đống Đa', 'Quận Hai Bà Trưng', 'Quận Thanh Xuân', 'Quận Cầu Giấy',
            'Quận Tây Hồ', 'Quận Long Biên', 'Quận Nam Từ Liêm', 'Quận Bắc Từ Liêm', 'Huyện Thanh Trì', 'Huyện Đông Anh',
            'Huyện Gia Lâm', 'Huyện Sóc Sơn', 'Huyện Hoài Đức', 'Huyện Đan Phượng', 'Huyện Thanh Oai', 'Huyện Thường Tín',
            'Huyện Phú Xuyên', 'Huyện Quốc Oai', 'Huyện Ba Vì', 'Huyện Mê Linh', 'Huyện Mỹ Đức', 'Huyện Ứng Hòa',
            'Huyện Chương Mỹ', 'Huyện Thạch Thất', 'Huyện Phúc Thọ'
            // ... thêm các quận/huyện khác nếu muốn ...
        ];

        return [
            'name' => $this->faker->unique()->randomElement($districts),
            'code' => $this->faker->unique()->numerify('D###'),
            'province_id' => Province::inRandomOrder()->first()?->id ?? Province::factory(),
        ];
    }
}
