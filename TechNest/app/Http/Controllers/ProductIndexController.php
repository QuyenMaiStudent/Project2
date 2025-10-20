<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductIndexController extends Controller
{
    public function __invoke()
    {
        $products = Product::with(['primaryImage', 'brand', 'seller', 'categories'])
            ->select('id', 'name', 'price', 'brand_id', 'created_by', 'description', 'created_at') // dùng description thay short_description
            ->where('is_active', true)
            ->where('status', 'approved')
            ->orderByDesc('id')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    // map description -> short_description for backwards compatibility in frontend
                    'short_description' => $p->description ?? null,
                    'created_at' => $p->created_at ? $p->created_at->toDateTimeString() : null,
                    'brand' => $p->brand ? ['id' => $p->brand->id, 'name' => $p->brand->name] : null,
                    'seller' => $p->seller ? ['id' => $p->seller->id, 'name' => $p->seller->name] : null,
                    'primary_image' => $p->primaryImage ? ['url' => $p->primaryImage->url] : null,
                    'categories' => $p->categories->map(function ($c) {
                        return ['id' => $c->id, 'name' => $c->name];
                    })->values(),
                ];
            });

        // Lấy tất cả brands và categories để sidbar lọc
        $brands = Brand::orderBy('name')->get(['id', 'name']);
        $categories = Category::orderBy('name')->get(['id', 'name']);
        
        return Inertia::render('ProductIndex', [
            'products' => $products,
            'brands' => $brands,
            'categories' => $categories,
        ]);
    }
}
