<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductIndexController extends Controller
{
    public function __invoke()
    {
        $products = Product::with(['primaryImage', 'brand'])
            ->select('id', 'name', 'brand_id')
            ->where('is_active', true)
            ->where('status', 'approved')
            ->orderByDesc('id')
            ->get();

        return Inertia::render('ProductIndex', [
            'products' => $products,
        ]);
    }
}
