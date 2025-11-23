<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function dashboard()
    {
        if (!Auth::user()->isSeller()) {
            return redirect()->route('home')->with('error', 'Chỉ seller mới được thêm sản phẩm');
        }
        
        $user = auth()->user();
        $totalProducts = Product::where('created_by', $user->id)->count();
        $activeProducts = Product::where('created_by', $user->id)->where('is_active', true)->count();
        $totalStock = Product::where('created_by', $user->id)->sum('stock');

        // bổ sung thông tin hữu ích
        $lowStockCount = Product::where('created_by', $user->id)->where('stock', '<', 10)->count();
        $draftCount = Product::where('created_by', $user->id)->where('is_active', false)->count();
        $recentProducts = Product::where('created_by', $user->id)
            ->with('primaryImage') // eager load relation ảnh chính
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get(['id','name','price','stock','is_active','created_at'])
            ->map(function($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'stock' => $p->stock,
                    'is_active' => $p->is_active,
                    'created_at' => $p->created_at,
                    // expose as "primary_image" để khớp frontend hiện tại
                    'primary_image' => $p->primaryImage ? ['url' => $p->primaryImage->url] : null,
                ];
            });
        
        // Thực tế: nên lấy dữ liệu activity thực tế (views/orders) nếu có bảng lưu analytics.
        $activity = [
            'labels' => [], // ví dụ: ['11/17','11/16',...]
            'views' => [],  // tương ứng lượt xem theo ngày
            'orders' => [], // tương ứng đơn hàng theo ngày
        ];

        return Inertia::render('SellerDashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'activeProducts' => $activeProducts,
                'totalStock' => $totalStock,
            ],
            'lowStockCount' => $lowStockCount,
            'draftCount' => $draftCount,
            'recentProducts' => $recentProducts,
            'userName' => $user->name,
            'activity' => $activity, // thêm field để frontend dùng vẽ biểu đồ
        ]);
    }
}
