<?php

namespace App\Http\Controllers\Chat;

use App\Http\Controllers\Controller;
use App\Models\Product;
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
        $messages = $request->input('message', $request->input('messages', []));

        if (!is_array($messages) || count($messages) === 0) {
            return response()->json(['error' => 'No messages provided'], 422);
        }

        // Kiểm tra xem có yêu cầu tìm kiếm sản phẩm không
        $userMessage = end($messages)['content'] ?? '';
        $searchResults = $this->searchProducts($userMessage);

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
            5. Tìm kiếm và giới thiệu sản phẩm phù hợp
            
            " . ($searchResults ? "KẾT QUẢ TÌM KIẾM:\n" . $searchResults : "") . "
            
            LƯU Ý:
            - Trả lời ngắn gọn, thân thiện và chuyên nghiệp
            - Khi có kết quả tìm kiếm, hãy trình bày dưới dạng danh sách với link chi tiết
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
        $text = $json['choices'][0]['message']['content'] ?? $json['choices'][0]['text'] ?? null;
        if ($text === null) {
            return response()->json(['error' => 'No content returned from provider', 'raw' => $json], 502);
        }

        return response()->json(['content' => $text, 'raw' => $json], $httpStatus ?: 200);
    }

    private function searchProducts($userMessage)
    {
        // Tìm từ khóa sản phẩm
        $productKeywords = ['iphone', 'samsung', 'laptop', 'macbook', 'ipad', 'tablet', 'điện thoại', 'máy tính', 'oppo', 'xiaomi', 'dell', 'hp', 'asus', 'lenovo'];
        
        // Tìm từ khóa thông số kỹ thuật
        $specKeywords = ['ram', 'ssd', 'hdd', 'cpu', 'processor', 'gb', 'tb', 'inch', 'mah', 'camera', 'megapixel', 'mp', 'core', 'ghz', 'storage', 'display', 'screen', 'battery'];
        
        $foundKeyword = null;
        $searchType = 'product'; // 'product' hoặc 'spec'
        
        // Kiểm tra từ khóa sản phẩm trước
        foreach ($productKeywords as $keyword) {
            if (stripos($userMessage, $keyword) !== false) {
                $foundKeyword = $keyword;
                $searchType = 'product';
                break;
            }
        }
        
        // Nếu không tìm thấy từ khóa sản phẩm, tìm từ khóa thông số
        if (!$foundKeyword) {
            foreach ($specKeywords as $keyword) {
                if (stripos($userMessage, $keyword) !== false) {
                    $foundKeyword = $keyword;
                    $searchType = 'spec';
                    break;
                }
            }
        }

        if (!$foundKeyword) {
            return null;
        }

        $query = Product::with(['brand', 'images', 'specs'])
            ->where('is_active', true)
            ->where('status', 'approved');

        if ($searchType === 'product') {
            // Tìm kiếm theo tên sản phẩm, mô tả, thương hiệu
            $query->where(function($q) use ($foundKeyword) {
                $q->where('name', 'LIKE', "%{$foundKeyword}%")
                  ->orWhere('description', 'LIKE', "%{$foundKeyword}%")
                  ->orWhereHas('brand', function($subQ) use ($foundKeyword) {
                      $subQ->where('name', 'LIKE', "%{$foundKeyword}%");
                  });
            });
        } else {
            // Tìm kiếm theo thông số kỹ thuật
            $query->where(function($q) use ($foundKeyword, $userMessage) {
                // Tìm trong specs
                $q->whereHas('specs', function($specQ) use ($foundKeyword, $userMessage) {
                    $specQ->where(function($innerQ) use ($foundKeyword, $userMessage) {
                        $innerQ->where('key', 'LIKE', "%{$foundKeyword}%")
                               ->orWhere('value', 'LIKE', "%{$foundKeyword}%");
                        
                        // Tìm kiếm thông minh hơn cho các trường hợp cụ thể
                        if (stripos($userMessage, 'ram') !== false) {
                            $innerQ->orWhere('key', 'LIKE', '%memory%')
                                   ->orWhere('key', 'LIKE', '%bộ nhớ%');
                        }
                        
                        if (stripos($userMessage, 'storage') !== false || stripos($userMessage, 'ssd') !== false || stripos($userMessage, 'hdd') !== false) {
                            $innerQ->orWhere('key', 'LIKE', '%storage%')
                                   ->orWhere('key', 'LIKE', '%lưu trữ%')
                                   ->orWhere('key', 'LIKE', '%ổ cứng%');
                        }
                        
                        if (stripos($userMessage, 'screen') !== false || stripos($userMessage, 'display') !== false || stripos($userMessage, 'inch') !== false) {
                            $innerQ->orWhere('key', 'LIKE', '%screen%')
                                   ->orWhere('key', 'LIKE', '%display%')
                                   ->orWhere('key', 'LIKE', '%màn hình%');
                        }
                        
                        if (stripos($userMessage, 'cpu') !== false || stripos($userMessage, 'processor') !== false) {
                            $innerQ->orWhere('key', 'LIKE', '%cpu%')
                                   ->orWhere('key', 'LIKE', '%processor%')
                                   ->orWhere('key', 'LIKE', '%vi xử lý%');
                        }
                    });
                })
                // Cũng tìm trong tên và mô tả sản phẩm
                ->orWhere('name', 'LIKE', "%{$foundKeyword}%")
                ->orWhere('description', 'LIKE', "%{$foundKeyword}%");
            });
        }

        $products = $query->limit(5)->get();

        if ($products->isEmpty()) {
            return null;
        }

        $result = "Tôi tìm thấy các sản phẩm phù hợp:\n\n";
        foreach ($products as $product) {
            $result .= "• {$product->name}\n";
            $result .= "  Giá: " . number_format($product->price) . "₫\n";
            
            if ($product->brand) {
                $result .= "  Thương hiệu: {$product->brand->name}\n";
            }
            
            // Hiển thị thông số liên quan nếu tìm kiếm theo spec
            if ($searchType === 'spec' && $product->specs->isNotEmpty()) {
                $relevantSpecs = $product->specs->filter(function($spec) use ($foundKeyword, $userMessage) {
                    return stripos($spec->key, $foundKeyword) !== false || 
                           stripos($spec->value, $foundKeyword) !== false ||
                           (stripos($userMessage, 'ram') !== false && (stripos($spec->key, 'memory') !== false || stripos($spec->key, 'ram') !== false)) ||
                           (stripos($userMessage, 'storage') !== false && (stripos($spec->key, 'storage') !== false || stripos($spec->key, 'ssd') !== false));
                });
                
                if ($relevantSpecs->isNotEmpty()) {
                    foreach ($relevantSpecs->take(2) as $spec) { // Chỉ hiển thị 2 specs liên quan nhất
                        $result .= "  {$spec->key}: {$spec->value}\n";
                    }
                }
            }
            
            $result .= "  👉 [Xem chi tiết](/products/{$product->id})\n\n";
        }

        return $result;
    }
}
