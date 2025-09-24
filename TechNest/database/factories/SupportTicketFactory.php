<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SupportTicket>
 */
class SupportTicketFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subjects = [
            'Yêu cầu hỗ trợ về đơn hàng',
            'Thắc mắc về sản phẩm',
            'Khiếu nại về chất lượng dịch vụ',
            'Cần tư vấn chọn mua laptop',
            'Báo lỗi khi thanh toán',
            'Hỏi về chính sách bảo hành',
            'Cập nhật thông tin tài khoản',
            'Đổi trả sản phẩm bị lỗi',
            'Hỗ trợ về chương trình khuyến mãi',
            'Góp ý về giao diện website'
        ];

        $messages = [
            'Tôi gặp vấn đề khi đặt hàng, mong được hỗ trợ sớm.',
            'Sản phẩm tôi nhận được không đúng như mô tả, vui lòng kiểm tra lại giúp tôi.',
            'Tôi muốn biết thêm thông tin về chính sách bảo hành của sản phẩm này.',
            'Tôi đã thanh toán nhưng chưa nhận được xác nhận đơn hàng.',
            'Xin tư vấn giúp tôi chọn laptop phù hợp với nhu cầu học tập.',
            'Tôi muốn đổi trả sản phẩm do bị lỗi kỹ thuật.',
            'Tôi gặp lỗi khi sử dụng chức năng thanh toán online.',
            'Tôi muốn cập nhật số điện thoại mới cho tài khoản.',
            'Chương trình khuyến mãi này áp dụng cho những sản phẩm nào?',
            'Giao diện website trên điện thoại chưa tối ưu, mong được cải thiện.'
        ];

        // Lấy danh sách user_id là admin
        $adminRoleId = DB::table('roles')->where('name', 'admin')->value('id');
        $adminUserIds = DB::table('user_role')->where('role_id', $adminRoleId)->pluck('user_id')->toArray();

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'subject' => $this->faker->randomElement($subjects),
            'message' => $this->faker->randomElement($messages),
            'status' => $this->faker->randomElement(['open', 'in_progress', 'resolved', 'closed']),
            'priority' => $this->faker->randomElement(['low', 'medium', 'high']),
            // assigned_to chỉ chọn user là admin
            'assigned_to' => !empty($adminUserIds) ? $this->faker->randomElement($adminUserIds) : null,
        ];
    }
}
