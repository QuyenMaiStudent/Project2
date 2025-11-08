<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductSearchController extends Controller
{
    public function index(Request $request)
    {
        $search = trim($request->input('search'));

        // Nếu search rỗng, trả mảng rỗng
        if ($search === '') {
            return Inertia::render('ProductIndex', [
                'products' => [],
                'brands' => Brand::orderBy('name')->get(['id', 'name']),
                'categories' => Category::orderBy('name')->get(['id', 'name']),
                'filters' => [
                    'search' => '',
                    'brand_id' => null,
                    'category_id' => null,
                    'price_min' => null,
                    'price_max' => null,
                ],
            ]);
        }

        $brandId = $request->input('brand_id');
        $categoryId = $request->input('category_id');
        $priceMin = $request->input('price_min');
        $priceMax = $request->input('price_max');

        $query = Product::with(['primaryImage', 'brand', 'categories', 'seller'])
            ->select('id', 'name', 'price', 'brand_id', 'created_by', 'description', 'created_at')
            ->where('is_active', true)
            ->where('status', 'approved');

        // Tìm kiếm theo tên, mô tả, ID
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%$search%")
              ->orWhere('description', 'like', "%$search%");
            if (is_numeric($search)) {
                $q->orWhere('id', $search);
            }
        });

        // Lọc theo thương hiệu
        if (!empty($brandId)) {
            $query->where('brand_id', $brandId);
        }

        // Lọc theo category
        if (!empty($categoryId)) {
            $query->whereHas('categories', function ($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        // Lọc giá min
        if (!empty($priceMin)) {
            $query->where('price', '>=', (float) $priceMin);
        }

        // Lọc giá max
        if (!empty($priceMax)) {
            $query->where('price', '<=', (float) $priceMax);
        }

        $products = $query->orderByDesc('id')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->id,
                    'name' => $p->name,
                    'price' => $p->price,
                    'short_description' => $p->description,
                    'created_at' => $p->created_at ? $p->created_at->toDateTimeString() : null,
                    'brand' => $p->brand ? ['id' => $p->brand->id, 'name' => $p->brand->name] : null,
                    'seller' => $p->seller ? ['id' => $p->seller->id, 'name' => $p->seller->name] : null,
                    'primary_image' => $p->primaryImage ? ['url' => $p->primaryImage->url] : null,
                    'categories' => $p->categories->map(fn($c) => [
                        'id' => $c->id,
                        'name' => $c->name,
                    ]),
                ];
            });

        return Inertia::render('ProductIndex', [
            'products' => $products,
            'brands' => Brand::orderBy('name')->get(['id', 'name']),
            'categories' => Category::orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
                'brand_id' => $brandId,
                'category_id' => $categoryId,
                'price_min' => $priceMin,
                'price_max' => $priceMax,
            ],
        ]);
    }
}
