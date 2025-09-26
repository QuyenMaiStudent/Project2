<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Inertia\Inertia;

class SellerController extends Controller
{
    public function dashboard()
    {
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
