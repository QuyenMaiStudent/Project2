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

        return Inertia::render('SellerDashboard', [
            'stats' => [
                'totalProducts' => $totalProducts,
                'activeProducts' => $activeProducts,
                'totalStock' => $totalStock,
            ]
        ]);
    }
}
