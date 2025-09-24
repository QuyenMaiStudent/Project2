<?php

namespace Database\Factories;

use App\Models\District;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Ward>
 */
class WardFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $wards = [
            'Phường Bến Nghé', 'Phường Bến Thành', 'Phường Cầu Kho', 'Phường Cầu Ông Lãnh', 'Phường Cô Giang',
            'Phường Đa Kao', 'Phường Nguyễn Thái Bình', 'Phường Nguyễn Cư Trinh', 'Phường Phạm Ngũ Lão',
            'Phường Tân Định', 'Phường 1', 'Phường 2', 'Phường 3', 'Phường 4', 'Phường 5', 'Phường 6',
            'Phường 7', 'Phường 8', 'Phường 9', 'Phường 10', 'Phường 11', 'Phường 12', 'Phường 13', 'Phường 14',
            'Xã Tân Xuân', 'Xã Đông Thạnh', 'Xã Thới Tam Thôn', 'Xã Trung Chánh', 'Xã Xuân Thới Đông',
            'Xã Xuân Thới Sơn', 'Xã Xuân Thới Thượng', 'Xã Bà Điểm', 'Thị trấn Hóc Môn', 'Xã Nhị Bình',
            'Xã Tân Hiệp', 'Xã Tân Thới Nhì', 'Xã Tân Xuân', 'Xã Trung Chánh', 'Xã Xuân Thới Đông'
            // ... thêm các phường/xã/thị trấn khác nếu muốn ...
        ];

        return [
            'name' => $this->faker->unique()->randomElement($wards),
            'code' => $this->faker->unique()->numerify('W###'),
            'district_id' => District::inRandomOrder()->first()?->id ?? District::factory(),
        ];
    }
}
