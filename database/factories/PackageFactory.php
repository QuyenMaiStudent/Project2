<?php

namespace Database\Factories;

use App\Models\Package;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Package>
 */
class PackageFactory extends Factory
{
    protected $model = Package::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Preset meaningful package templates
        $templates = [
            [
                'name' => 'Gói Tiêu Chuẩn',
                'description' => 'Phù hợp với người bán nhỏ lẻ — giao hàng trong 3-5 ngày.',
                'price' => 30000,
                'duration_days' => 30,
                'features' => ['Hỗ trợ tracking', 'Miễn phí đóng gói cơ bản'],
            ],
            [
                'name' => 'Gói Nhanh',
                'description' => 'Giao nhanh trong 24-48 giờ, dành cho đơn gấp.',
                'price' => 70000,
                'duration_days' => 30,
                'features' => ['Giao tốc hành', 'Ưu tiên xử lý đơn'],
            ],
            [
                'name' => 'Gói Doanh Nghiệp',
                'description' => 'Dành cho shop/ doanh nghiệp — nhiều tiện ích nâng cao.',
                'price' => 200000,
                'duration_days' => 30,
                'features' => ['Quét mã vạch', 'Báo cáo hàng tuần', 'Quyền quản lý người dùng'],
            ],
        ];

        $pick = $this->faker->randomElement($templates);

        return [
            'name' => $pick['name'],
            'description' => $pick['description'],
            'price' => $pick['price'],
            'duration_days' => $pick['duration_days'],
            'is_active' => true,
            'features' => $pick['features'],
        ];
    }

    /** Optional named states */
    public function standard()
    {
        return $this->state(fn() => [
            'name' => 'Gói Tiêu Chuẩn',
            'price' => 30000,
            'duration_days' => 30,
            'is_active' => true,
        ]);
    }
}
