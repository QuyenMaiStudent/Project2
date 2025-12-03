<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\WarrantyPolicy>
 */
class WarrantyPolicyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [
            'Bảo hành chính hãng 12 tháng',
            'Bảo hành mở rộng 24 tháng',
            'Bảo hành 1 đổi 1 trong 30 ngày',
            'Bảo hành phần cứng 6 tháng',
            'Bảo hành toàn diện 36 tháng',
        ];

        $contents = [
            'Sản phẩm được bảo hành miễn phí các lỗi kỹ thuật do nhà sản xuất trong thời gian quy định.',
            'Chính sách bảo hành áp dụng cho các sản phẩm còn nguyên tem và hóa đơn mua hàng.',
            'Khách hàng được đổi mới sản phẩm trong vòng 30 ngày nếu phát sinh lỗi phần cứng.',
            'Bảo hành không áp dụng cho các trường hợp rơi vỡ, vào nước hoặc tự ý sửa chữa.',
            'Hỗ trợ bảo hành tận nơi cho khách hàng tại các thành phố lớn.',
            'Thời gian xử lý bảo hành từ 3-7 ngày làm việc kể từ khi nhận sản phẩm.',
            'Khách hàng vui lòng liên hệ tổng đài hỗ trợ để được hướng dẫn chi tiết về quy trình bảo hành.',
        ];

        return [
            'title' => $this->faker->randomElement($titles),
            'content' => $this->faker->randomElement($contents),
            'duration_months' => $this->faker->randomElement([6, 12, 24, 36]),
        ];
    }
}
