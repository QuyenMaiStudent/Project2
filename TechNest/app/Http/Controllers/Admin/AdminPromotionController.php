<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\PromotionCondition;
use App\Models\Brand;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Validation\ValidationException;

class AdminPromotionController extends Controller
{
    // Hiển thị danh sách mã khuyến mãi toàn hệ thống
    public function index(Request $request)
    {
        $query = Promotion::with(['conditions', 'seller'])
            ->when($request->has('q'), fn($q) => $q->where('code', 'like', "%{$request->q}%"))
            ->orderByDesc('id');

        $promotions = $query->paginate(20)->withQueryString();

        // trả về map id=>name để frontend hiển thị rõ tên
        $brands = Brand::pluck('name', 'id')->toArray();
        $products = Product::pluck('name', 'id')->toArray();
        $categories = Category::pluck('name', 'id')->toArray();

        return Inertia::render('Admin/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => $request->only(['q']),
            'brands' => $brands,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    // Hiển thị form tạo mã
    public function create()
    {
        $brands = Brand::orderBy('name')->get();
        $products = Product::where('is_active', true)->orderBy('name')->limit(500)->get();
        $categories = Category::orderBy('name')->get();

        return Inertia::render('Admin/Promotions/Create', [
            'brands' => $brands,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    // Lưu mã khuyến mãi mới
    public function store(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|unique:promotions,code',
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'min_order_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'is_active' => 'nullable|boolean',
            'conditions' => 'nullable|array',
            'conditions.*.condition_type' => 'required_with:conditions|in:brand,product,category',
            'conditions.*.target_id' => 'required_with:conditions|integer|min:1',
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

        // starts_at không được ở quá khứ (phải >= now)
        if (!empty($data['starts_at'])) {
            $starts = Carbon::parse($data['starts_at']);
            if ($starts->lt(Carbon::now())) {
                throw ValidationException::withMessages([
                    'starts_at' => 'Thời gian bắt đầu phải là hiện tại hoặc tương lai. Vui lòng chọn ngày/giờ từ bây giờ trở đi.'
                ]);
            }
        }

        DB::transaction(function () use ($data) {
            $promotion = Promotion::create([
                'code' => $data['code'],
                'type' => $data['type'],
                'value' => $data['value'],
                'description' => $data['description'] ?? null,
                // nếu DB không cho NULL, lưu 0 khi không có giá tối thiểu
                'min_order_amount' => $data['min_order_amount'] ?? 0,
                'usage_limit' => $data['usage_limit'] ?? null,
                'starts_at' => $data['starts_at'] ?? null,
                'expires_at' => $data['expires_at'] ?? null,
                'is_active' => $data['is_active'] ?? true,
                'seller_id' => null, // admin-created global promotion by default
            ]);

            if (!empty($data['conditions'])) {
                $conds = array_map(fn($c) => [
                    'promotion_id' => $promotion->id,
                    'condition_type' => $c['condition_type'],
                    'target_id' => $c['target_id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $data['conditions']);

                PromotionCondition::insert($conds);
            }
        });

        return redirect()->route('admin.promotions.index')->with('success', 'Mã khuyến mãi đã được tạo');
    }

    // Xóa mã khuyến mãi
    public function destroy($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->delete();

        return redirect()->route('admin.promotions.index')->with('success', 'Khuyến mãi đã bị xóa');
    }

    // Bật/tắt trạng thái mã
    public function toggleStatus($id)
    {
        $promotion = Promotion::findOrFail($id);
        $promotion->is_active = !$promotion->is_active;
        $promotion->save();

        return redirect()->back()->with('success', 'Trạng thái đã được thay đổi');
    }

    // Gán điều kiện áp dụng (sản phẩm, danh mục, thương hiệu)
    public function assignTargets(Request $request, $id)
    {
        $promotion = Promotion::findOrFail($id);

        $data = $request->validate([
            'conditions' => 'nullable|array',
            'conditions.*.condition_type' => 'required_with:conditions|in:brand,product,category',
            'conditions.*.target_id' => 'required_with:conditions|integer|min:1',
        ]);

        DB::transaction(function () use ($promotion, $data) {
            PromotionCondition::where('promotion_id', $promotion->id)->delete();

            if (!empty($data['conditions'])) {
                $conds = array_map(fn($c) => [
                    'promotion_id' => $promotion->id,
                    'condition_type' => $c['condition_type'],
                    'target_id' => $c['target_id'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ], $data['conditions']);

                PromotionCondition::insert($conds);
            }
        });

        return redirect()->back()->with('success', 'Điều kiện áp dụng đã được cập nhật');
    }

    // Xem thống kê lượt sử dụng mã
    public function usageStats($id)
    {
        $promotion = Promotion::with(['users' => function ($q) {
            $q->select('users.id', 'users.name', 'users.email');
        }])->findOrFail($id);

        // total usages from used_count and pivot if available
        $totalUsed = $promotion->used_count ?? 0;
        $usages = $promotion->users->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'used_times' => $u->pivot->used_times ?? null,
            ];
        });

        return Inertia::render('Admin/Promotions/Usage', [
            'promotion' => $promotion,
            'total_used' => $totalUsed,
            'usages' => $usages,
        ]);
    }
}
