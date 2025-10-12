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
    public function dashboard(User $user)
    {
        if (!Auth::user()->isAdmin()) {
            return redirect()->route('home')->with('error', 'Chỉ admin mới được truy cập trang này.');
        }
        
        $totalUsers = User::count();

        // Sửa lại dòng này cho đúng với quan hệ role/roles
        $totalSellers = User::whereHas('role', function ($q) {
            $q->where('name', 'seller');
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
