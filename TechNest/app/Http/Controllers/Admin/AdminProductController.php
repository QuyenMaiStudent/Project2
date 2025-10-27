<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    // Quản lý danh sách sản phẩm (có thể filter theo seller)
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'seller']);

        if ($request->filled('seller')) {
            $query->where('created_by', $request->input('seller'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        return Inertia::render('Admin/ManageProducts', [
            'products' => $products,
            'filters' => $request->only(['seller', 'status']),
        ]);
    }

    // Hiển thị chi tiết sản phẩm (giữ nguyên)
    public function show(Product $product)
    {
        $product->load([
            'brand',
            'images',
            'specs',
            'variants',
            'seller',
            'warrantyPolicy',
            'categories',
        ]);

        $allCategories = Category::all();
        return Inertia::render('Admin/ShowProduct', [
            'product' => $product,
            'allCategories' => $allCategories,
        ]);
    }

    // Cập nhật status sản phẩm trực tiếp (admin quản lý)
    public function updateStatus(Request $request, Product $product)
    {
        $request->validate([
            'status' => ['required', Rule::in(['draft','active','inactive','archived','approved','rejected'])],
        ]);

        $product->update(['status' => $request->status]);

        return back()->with('success', 'Trạng thái sản phẩm đã được cập nhật.');
    }

    // Cập nhật category (giữ nguyên)
    public function updateCategories(Request $request, Product $product)
    {
        $request->validate([
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
        ], [
            'categories.*.exists' => 'Danh mục không hợp lệ.',
        ]);
        $product->categories()->sync($request->categories ?? []);
        return back()->with('success', 'Đã cập nhật danh mục cho sản phẩm!');
    }
}