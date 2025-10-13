<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;

use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Trang dashboard admin
    public function dashboard()
    {
        // Cho phép admin HOẶC superadmin truy cập dashboard
        if (! (Auth::user()->isAdmin() || Auth::user()->isSuperAdmin()) ) {
            return redirect()->route('home')->with('error', 'Chỉ admin hoặc superadmin mới được truy cập trang này.');
        }
        
        $totalUsers = User::count();

        // Đếm sellers: kiểm tra cả role (belongsTo) và roles (pivot)
        $totalSellers = User::where(function($q) {
            $q->whereHas('role', function($r){ $r->where('name', 'seller'); })
              ->orWhereHas('roles', function($r){ $r->where('name', 'seller'); });
        })->count();
        
        $totalProducts = Product::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total_amount');

        return Inertia::render('AdminDashboard', [
            'totalUsers' => $totalUsers,
            'totalSellers' => $totalSellers,
            'totalProducts' => $totalProducts,
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
        ]);
    }
}
