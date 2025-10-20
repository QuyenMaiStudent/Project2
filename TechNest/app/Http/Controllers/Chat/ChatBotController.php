<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ChatBotController extends Controller
{
    public function chat(Request $request)
    {
        $apiKey = env('GROQ_API_KEY', '');
        if (empty($apiKey)) {
            return response()->json(['error' => 'GROQ_API_KEY not configured'], 500);
        }

        $model = $request->string('model')->toString() ?: 'llama-3.3-70b-versatile';
        // accept either `message` (singular) or `messages`
        $messages = $request->input('message', $request->input('messages', []));

        if (!is_array($messages) || count($messages) === 0) {
            return response()->json(['error' => 'No messages provided'], 422);
        }

        $systemPrompt = [
            'role' => 'system',
            'content' => "Bạn là trợ lý AI của TechNest - cửa hàng bán đồ công nghệ. 
    
            THÔNG TIN VỀ TECHNEST:
            - Website: technest.vn
            - Hotline: 0979701300
            - Sản phẩm chính: Điện thoại, laptop, tablet, phụ kiện, thiết bị thông minh
            - Thương hiệu đối tác: Apple, Samsung, Xiaomi, Oppo, Dell, HP, Asus, Lenovo,...
            
            CHÍNH SÁCH CỬA HÀNG:
            - Bảo hành: 12-24 tháng tùy sản phẩm
            - Đổi trả: 7 ngày với sản phẩm lỗi
            - Giao hàng: Miễn phí với đơn >500k
            - Thanh toán: COD, chuyển khoản, thẻ tín dụng, trả góp 0%
            
            NHIỆM VỤ:
            1. Tư vấn sản phẩm công nghệ phù hợp với nhu cầu khách hàng
            2. Giải đáp thắc mắc về đặc điểm kỹ thuật, giá cả, khuyến mãi
            3. Hướng dẫn quy trình mua hàng và theo dõi đơn hàng
            4. Giải thích chính sách bảo hành, đổi trả, vận chuyển
            
            LƯU Ý:
            - Trả lời ngắn gọn, thân thiện và chuyên nghiệp
            - Không chia sẻ thông tin sai lệch về sản phẩm
            - Chỉ trả lời các câu hỏi liên quan đến mua bán đồ công nghệ hoặc cửa hàng
            - Với các câu hỏi không liên quan, lịch sự từ chối và gợi ý người dùng hỏi về sản phẩm công nghệ
            - Khi không chắc chắn về thông tin, đề nghị khách hàng liên hệ hotline
            
            Luôn sử dụng tiếng Việt trong câu trả lời."
        ];

        array_unshift($messages, $systemPrompt);

        $payload = [
            'model' => $model,
            'messages' => $messages,
            'temperature' => (float) $request->input('temperature', 0.5),
            'stream' => false,
        ];

        $ch = curl_init('https://api.groq.com/openai/v1/chat/completions');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/json",
                "Authorization: Bearer " . $apiKey,
            ],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload),
            CURLOPT_TIMEOUT => 60,
        ]);

        $out = curl_exec($ch);
        $errNo = curl_errno($ch);
        $errMsg = curl_error($ch);
        $httpStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($errNo) {
            return response()->json(['error' => "cURL error: {$errMsg}", 'errno' => $errNo], 500);
        }

        $json = json_decode($out ?: '{}', true);
        // safe access to choices path
        $text = $json['choices'][0]['message']['content'] ?? $json['choices'][0]['text'] ?? null;
        if ($text === null) {
            return response()->json(['error' => 'No content returned from provider', 'raw' => $json], 502);
        }

        return response()->json(['content' => $text, 'raw' => $json], $httpStatus ?: 200);
    }
}
