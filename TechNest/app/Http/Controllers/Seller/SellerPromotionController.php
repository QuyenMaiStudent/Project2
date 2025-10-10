<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use App\Models\PromotionCondition;
use App\Models\Brand;
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

        return Inertia::render('Seller/Promotions/Index', [
            'promotions' => $promotions,
            'filters' => $request->only(['q']),
            'brands' => $brands,
        ]);
    }

    //Hiển thị form tạo mã khuyến mãi
    public function create()
    {
        $sellerId = Auth::id();
        // brands table hiện không chứa seller_id => trả về tất cả brand
        $brands = Brand::all();
        return Inertia::render('Seller/Promotions/Create', [
            'brands' => $brands,
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
            'conditions' => 'nullable|array',
            'conditions.*.condition_type' => 'required_with:conditions|in:category,product,brand',
            'conditions.*.target_id' => 'required_with:conditions|integer',
        ]);

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

            if (!empty($data['conditions'])) {
                foreach ($data['conditions'] as $cond) {
                    $promotion->conditions()->create([
                        'condition_type' => $cond['condition_type'],
                        'target_id' => $cond['target_id'],
                    ]);
                }
            }
        });

        return redirect()->route('seller.promotions.index')->with('success', 'Khuyến mãi đã được tạo');
    }

    //Chỉnh sửa mã khuyến mãi
    public function edit($id)
    {
        $sellerId = Auth::id();
        $promotion = Promotion::with('conditions')->where('seller_id', $sellerId)->findOrFail($id);
        // brands table hiện không chứa seller_id => trả về tất cả brand
        $brands = Brand::all();

        return Inertia::render('Seller/Promotions/Edit', [
            'promotion' => $promotion,
            'brands' => $brands,
        ]);
    }

    //Cập nhật mã khuyến mãi
    public function update(Request $request, $id)
    {
        $sellerId = Auth::id();
        $promotion = Promotion::where('seller_id', $sellerId)->findOrFail($id);

        $data = $request->validate([
            'type' => 'required|in:fixed,percent',
            'value' => 'required|numeric|min:0.01',
            'description' => 'nullable|string',
            'min_order_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'starts_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after_or_equal:starts_at',
            'conditions' => 'nullable|array',
            'conditions.*.id' => 'nullable|integer|exists:promotion_conditions,id',
            'conditions.*.condition_type' => 'required_with:conditions|in:category,product,brand',
            'conditions.*.target_id' => 'required_with:conditions|integer',
        ]);

        DB::transaction(function () use ($promotion, $data) {
            $promotion->update([
                'type' => $data['type'],
                'value' => $data['value'],
                'description' => $data['description'] ?? null,
                'min_order_amount' => $data['min_order_amount'] ?? 0,
                'usage_limit' => $data['usage_limit'] ?? null,
                'starts_at' => !empty($data['starts_at']) ? Carbon::parse($data['starts_at']) : null,
                'expires_at' => !empty($data['expires_at']) ? Carbon::parse($data['expires_at']) : null,
            ]);

            // simple sync: delete existing and recreate
            $promotion->conditions()->delete();
            if (!empty($data['conditions'])) {
                foreach ($data['conditions'] as $cond) {
                    $promotion->conditions()->create([
                        'condition_type' => $cond['condition_type'],
                        'target_id' => $cond['target_id'],
                    ]);
                }
            }
        });

        return redirect()->route('seller.promotions.index')->with('success', 'Khuyến mãi đã được cập nhật');
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
