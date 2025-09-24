<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\SupportTicket;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SupportTicketReply>
 */
class SupportTicketReplyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $messages = [
            'Cảm ơn bạn đã liên hệ, chúng tôi sẽ kiểm tra và phản hồi sớm nhất.',
            'Vui lòng cung cấp thêm thông tin để chúng tôi hỗ trợ tốt hơn.',
            'Chúng tôi đã tiếp nhận yêu cầu và đang xử lý.',
            'Bạn vui lòng kiểm tra lại đơn hàng trong mục tài khoản.',
            'Xin lỗi vì sự bất tiện, chúng tôi sẽ khắc phục trong thời gian sớm nhất.',
            'Yêu cầu của bạn đã được chuyển đến bộ phận kỹ thuật.',
            'Bạn có thể đổi trả sản phẩm trong vòng 7 ngày kể từ khi nhận hàng.',
            'Chúng tôi đã cập nhật thông tin tài khoản cho bạn.',
            'Khuyến mãi này chỉ áp dụng cho một số sản phẩm nhất định.',
            'Nếu còn thắc mắc, bạn vui lòng liên hệ tổng đài hỗ trợ 24/7.',
        ];

        return [
            'support_ticket_id' => SupportTicket::inRandomOrder()->first()?->id ?? SupportTicket::factory(),
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'message' => $this->faker->randomElement($messages),
        ];
    }
}
