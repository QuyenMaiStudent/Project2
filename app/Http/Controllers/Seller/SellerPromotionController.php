<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\Brand;
use App\Models\Product;
use App\Models\PromotionCondition; // thêm import
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class SellerPromotionController extends Controller
{
    //Danh sách mã khuyến mãi của người bán
    public function index(Request $request)
    {
        $sellerId = Auth::id();

        // cần load `conditions` để biết promotion áp dụng cho brand/product/category hay là áp dụng cho tất cả
        $query = Promotion::with('conditions')->where('seller_id', $sellerId)
            ->when($request->has('q'), fn($q) => $q->where('code', 'like', "%{$request->q}%"))
            ->orderByDesc('id');

        $promotions = $query->paginate(15)->withQueryString();

        // nếu muốn hiển thị tên brand ở list, đưa brands tới frontend
        $brands = Brand::all();
        // đưa danh sách sản phẩm do seller tạo để frontend hiển thị/lọc
        $products = Product::where('created_by', $sellerId)->get();

        return Inertia::render('Seller/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => $request->only(['q']),
            'brands' => $brands,
            'products' => $products,
        ]);
    }

    //Hiển thị form tạo mã khuyến mãi
    public function create()
    {
        $sellerId = Auth::id();
        // brands table hiện không chứa seller_id => trả về tất cả brand
        $brands = Brand::all();
        // danh sách sản phẩm do seller tạo để chọn khi tạo khuyến mãi
        $products = Product::where('created_by', $sellerId)->get();
        return Inertia::render('Seller/Promotions/Create', [
            'brands' => $brands,
            'products' => $products,
        ]);
    }

    //Lưu mã khuyến mãi mới
    public function store(Request $request)
    {
        $sellerId = Auth::id();

        $data = $request->validate([
            'code' => 'required|string|unique:promotions,code',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'min_order_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'apply_all' => 'required|boolean',
            'conditions' => 'nullable|array',
            'conditions.*.condition_type' => 'required_with:conditions|in:product',
            'conditions.*.target_id' => 'required_with:conditions|integer',
        ]);

        // Thêm kiểm tra giá trị hợp lý dựa trên type
        if ($data['type'] === 'percent') {
            if ($data['value'] > 100) {
                throw ValidationException::withMessages(['value' => "Giá trị phần trăm không được vượt quá 100%."]);
            }
            if ($data['value'] > 20) {
                throw ValidationException::withMessages(['value' => "Phần trăm giảm giá tối đa cho mỗi mã khuyến mãi là 20%. Vui lòng chọn giá trị thấp hơn."]);
            }
        } elseif ($data['type'] === 'fixed') {
            if ($data['value'] > 1000000) {
                throw ValidationException::withMessages(['value' => "Giá trị giảm giá cố định không được vượt quá 1.000.000 VNĐ. Vui lòng chọn giá trị thấp hơn."]);
            }
        }

        if (!empty($data['starts_at'])) {
            $starts = Carbon::parse($data['starts_at']);
            if ($starts->lt(Carbon::now())) {
                throw ValidationException::withMessages(['starts_at' => 'Thời gian bắt đầu phải là hiện tại hoặc tương lai. Vui lòng chọn ngày/giờ từ bây giờ trở đi.']);
            }
        }

        if (!empty($data['conditions'])) {
            foreach ($data['conditions'] as $cond) {
                if ($cond['condition_type'] === 'product') {
                    if (!Product::where('id', $cond['target_id'])
                        ->where('created_by', $sellerId)->exists()) {
                        throw ValidationException::withMessages(['conditions' => 'Bạn chỉ có thể tạo khuyến mãi cho sản phẩm của chính bạn.']);
                    }
                } else {
                    throw ValidationException::withMessages(['conditions' => 'Loại condition không hợp lệ.']);
                }
            }
        }

        DB::transaction(function () use ($data, $sellerId) {
            $promotion = Promotion::create([
                'code' => $data['code'],
                'type' => $data['type'],
                'value' => $data['value'],
                'description' => $data['description'] ?? null,
                'min_order_amount' => $data['min_order_amount'] ?? 0,
                'usage_limit' => $data['usage_limit'] ?? null,
                'used_count' => 0,
                'starts_at' => !empty($data['starts_at']) ? Carbon::parse($data['starts_at']) : null,
                'expires_at' => !empty($data['expires_at']) ? Carbon::parse($data['expires_at']) : null,
                'is_active' => true,
                'seller_id' => $sellerId,
            ]);

            if ($data['apply_all']) {
                $productIds = Product::where('created_by', $sellerId)->pluck('id')->all();
                $rows = array_map(fn($id) => [
                    'promotion_id' => $promotion->id,
                    'condition_type' => 'product',
                    'target_id' => $id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $productIds);
                if ($rows) PromotionCondition::insert($rows);
            } elseif (!empty($data['conditions'])) {
                $rows = array_map(fn($c) => [
                    'promotion_id' => $promotion->id,
                    'condition_type' => 'product',
                    'target_id' => $c['target_id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $data['conditions']);
                PromotionCondition::insert($rows);
            }
        });

        return redirect()->route('seller.promotions.index')->with('success', 'Khuyến mãi đã được tạo');
    }

    //Xóa mã khuyến mãi
    public function destroy($id)
    {
        $sellerId = Auth::id();
        $promotion = Promotion::where('seller_id', $sellerId)->findOrFail($id);

        DB::transaction(function () use ($promotion) {
            $promotion->conditions()->delete();
            $promotion->delete();
        });

        return redirect()->route('seller.promotions.index')->with('success', 'Khuyến mãi đã được xóa');
    }

    //Chuyển đổi trạng thái kích hoạt của mã khuyến mãi
    public function toggleStatus($id)
    {
        $sellerId = Auth::id();
        $promotion = Promotion::where('seller_id', $sellerId)->findOrFail($id);

        $promotion->is_active = !$promotion->is_active;
        $promotion->save();

        return redirect()->route('seller.promotions.index')->with('success', 'Trạng thái khuyến mãi đã được cập nhật');
    }

    //Thống kê lượt sử dụng mã khuyến mãi
    public function usageStats($id)
    {
        $sellerId = Auth::id();
        $promotion = Promotion::where('seller_id', $sellerId)->findOrFail($id);

        // simple aggregation from promotion_usages table
        $usages = $promotion->users()->select('users.id','users.name','promotion_usages.used_times')->get();

        return Inertia::render('Seller/Promotions/UsageStats', [
            'promotion' => $promotion,
            'usages' => $usages,
        ]);
    }
}
