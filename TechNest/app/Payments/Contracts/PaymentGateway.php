<?php

namespace App\Payments\Contracts;

use App\Models\Order;

interface PaymentGateway
{
    //Khởi tạo thanh toán thông qua Gateway
    public function createPayment(Order $order): string;

    //Xử lý callback khi thanh toán xong
    public function handleReturn(array $payload): array;

    //Xử lý webhook tùy theo nhà cung cấp (momo, stripe, paypal, vnpay, ...)
    public function handleWebhook(array $payload, ?string $signature = null): array;
    
}
