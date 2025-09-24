<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $titles = [
            'Đơn hàng mới đã được tạo',
            'Đơn hàng của bạn đã được xác nhận',
            'Đơn hàng đã giao thành công',
            'Có khuyến mãi mới dành cho bạn',
            'Tài khoản của bạn đã được cập nhật',
            'Mật khẩu đã được thay đổi',
            'Sản phẩm yêu thích vừa giảm giá',
            'Hỗ trợ đã trả lời yêu cầu của bạn',
            'Thông báo bảo trì hệ thống',
            'Chào mừng bạn đến với TechNest'
        ];

        $messages = [
            'Cảm ơn bạn đã đặt hàng tại TechNest. Đơn hàng của bạn đang được xử lý.',
            'Đơn hàng của bạn đã được xác nhận và sẽ sớm được giao đến bạn.',
            'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã tin tưởng TechNest!',
            'Đừng bỏ lỡ các chương trình khuyến mãi hấp dẫn chỉ dành riêng cho bạn.',
            'Thông tin tài khoản của bạn đã được cập nhật thành công.',
            'Bạn vừa thay đổi mật khẩu. Nếu không phải bạn, vui lòng liên hệ hỗ trợ.',
            'Sản phẩm trong danh sách yêu thích của bạn vừa được giảm giá. Mua ngay!',
            'Yêu cầu hỗ trợ của bạn đã được phản hồi. Vui lòng kiểm tra chi tiết.',
            'Hệ thống sẽ bảo trì vào đêm nay. Mong bạn thông cảm vì sự bất tiện này.',
            'Chào mừng bạn đến với TechNest! Khám phá ngay các sản phẩm công nghệ mới nhất.'
        ];

        return [
            'user_id' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'title' => $this->faker->randomElement($titles),
            'message' => $this->faker->randomElement($messages),
            'is_read' => $this->faker->boolean(30),
        ];
    }
}
