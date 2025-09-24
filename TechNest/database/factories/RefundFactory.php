<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payment;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Refund>
 */
class RefundFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $reasons = [
            'Sản phẩm bị lỗi hoặc hỏng khi nhận hàng',
            'Khách hàng đổi ý không muốn mua nữa',
            'Giao sai sản phẩm hoặc thiếu phụ kiện',
            'Sản phẩm không đúng mô tả trên website',
            'Đơn hàng bị hủy theo yêu cầu khách hàng',
            'Không nhận được hàng sau thời gian cam kết',
            'Sản phẩm bị trầy xước, móp méo khi giao',
            'Khách hàng đã thanh toán nhưng muốn hoàn tiền',
            'Sản phẩm không hoạt động đúng chức năng',
            'Khách hàng muốn đổi sang sản phẩm khác',
        ];

        return [
            'payment_id' => Payment::inRandomOrder()->first()?->id ?? Payment::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'amount' => $this->faker->numberBetween(10000, 500000),
            'status' => $this->faker->randomElement(['requested', 'approved', 'rejected', 'completed']),
            'reason' => $this->faker->randomElement($reasons),
            'requested_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
