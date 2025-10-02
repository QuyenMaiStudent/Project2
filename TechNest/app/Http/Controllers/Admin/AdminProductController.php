<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    //Hiển thị danh sách sản phẩm chờ duyệt
    public function pending()
    {
        $products = Product::with(['brand', 'seller'])
            ->where('status', 'pending')
            ->paginate(12);

        return Inertia::render('Admin/PendingProducts', [
            'products' => $products,
        ]);
    }

    //Hiển thị chi tiết sản phẩm
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

    //Duyệt sản phẩm
    public function approve(Product $product)
    {
        if ($product->status !== 'pending') {
            return back()->with('error', 'Chỉ có thể duyệt sản phẩm đang chờ duyệt.');
        }
        $product->update(['status' => 'approved']);
        return back()->with('success', 'Sản phẩm đã được duyệt.');
    }

    //Từ chối sản phẩm
    public function reject(Product $product)
    {
        if ($product->status !== 'pending') {
            return back()->with('error', 'Chỉ có thể từ chối sản phẩm đang chờ duyệt.');
        }
        $product->update(['status' => 'rejected']);
        return back()->with('success', 'Sản phẩm đã bị từ chối.');
    }

    //Danh sách sản phẩm đã duyệt
    public function approved()
    {
        $products = Product::with(['brand', 'seller'])
            ->where('status', 'approved')
            ->paginate(12);

        return Inertia::render('Admin/ApprovedProducts', [
            'products' => $products,
        ]);
    }

    //Danh sách sản phẩm bị từ chối
    public function rejected()
    {
        $products = Product::with(['brand', 'seller'])
            ->where('status', 'rejected')
            ->paginate(12);

        return Inertia::render('Admin/RejectedProducts', [
            'products' => $products,
        ]);
    }

    //Cập nhật category
    public function updateCategories(Request $request, Product $product)
    {
        $request->validate([
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
        ]);
        $product->categories()->sync($request->categories ?? []);
        return back()->with('success', 'Đã cập nhật danh mục cho sản phẩm!');
    }
}