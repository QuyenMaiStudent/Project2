<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Package;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Remove existing sample packages to avoid duplicates when re-seeding
        Package::whereIn('name', [
            'Gói Tiêu Chuẩn',
            'Gói Nhanh',
            'Gói Doanh Nghiệp',
        ])->delete();

        // Create explicit meaningful packages so UI shows them
        Package::create([
            'name' => 'Gói Tiêu Chuẩn',
            'description' => 'Phù hợp với người bán nhỏ lẻ — giao hàng trong 3-5 ngày.',
            'price' => 30000,
            'duration_days' => 30,
            'is_active' => true,
            'features' => ['Hỗ trợ tracking', 'Miễn phí đóng gói cơ bản'],
        ]);

        Package::create([
            'name' => 'Gói Nhanh',
            'description' => 'Giao nhanh trong 24-48 giờ, dành cho đơn gấp.',
            'price' => 70000,
            'duration_days' => 30,
            'is_active' => true,
            'features' => ['Giao tốc hành', 'Ưu tiên xử lý đơn'],
        ]);

        Package::create([
            'name' => 'Gói Doanh Nghiệp',
            'description' => 'Dành cho shop/ doanh nghiệp — nhiều tiện ích nâng cao.',
            'price' => 200000,
            'duration_days' => 30,
            'is_active' => true,
            'features' => ['Quét mã vạch', 'Báo cáo hàng tuần', 'Quyền quản lý người dùng'],
        ]);
    }
}
