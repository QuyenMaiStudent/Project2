<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    //Hiển thị danh sách biến thể của sản phẩm
    public function index (Product $product)
    {
        $this->authorizeProduct($product);

        $variants = $product->variants()->get();

        return Inertia::render('Seller/ProductVariants/Index', [
            'product' => $product,
            'variants' => $variants,
        ]);
    }

    //Thêm mới biến thể
    public function store (Request $request, Product $product)
    {
        $this->authorizeProduct($product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'additional_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product->variants()->create($validated);

        return back()->with('success', 'Đã thêm biến thể sản phẩm.');
    }

    //Sửa
    public function update (Request $request, Product $product, ProductVariant $variant)
    {
        $this->authorizeProduct($product);

        if ($variant->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'additional_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $variant->update($validated);

        return back()->with('success', 'Đã cập nhật biến thể sản phẩm.');
    }

    //Xóa
    public function destroy (Product $product, ProductVariant $variant)
    {
        $this->authorizeProduct($product);

        if ($variant->product_id !== $product->id) {
            abort(403);
        }

        $variant->delete();

        return back()->with('success', 'Đã xóa biến thể sản phẩm.');
    }

    //Hàm kiểm tra quyền sở hữu sản phẩm
    private function authorizeProduct (Product $product)
    {
        if ($product->created_by !== auth()->id()) {
            abort(403, "Bạn không có quyền thao tác với sản phẩm này.");
        }
    }
}
