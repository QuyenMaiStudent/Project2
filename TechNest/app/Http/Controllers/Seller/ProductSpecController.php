<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSpec;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductSpecController extends Controller
{
    //Hiển thị danh sách thông số của sản phẩm
    public function index (Product $product)
    {
        $this->authorizeProduct($product);

        $specs = $product->specs()->get();

        return Inertia::render('Products/ProductSpecs', [
            'product' => $product,
            'specs' => $specs,
        ]);
    }

    //Thêm mới thông số
    public function store (Request $request, Product $product)
    {
        $this->authorizeProduct($product);

        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string|max:255',
        ]);

        $product->specs()->create($validated);

        return back()->with('success', 'Đã thêm thông số sản phẩm.');
    }

    //Sửa
    public function update (Request $request, Product $product, ProductSpec $spec)
    {
        $this->authorizeProduct($product);

        if ($spec->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'key' => 'required|string|max:255',
            'value' => 'required|string|max:255',
        ]);

        $spec->update($validated);

        return back()->with('success', 'Đã cập nhật thông số sản phẩm.');
    }

    //Xóa
    public function destroy (Product $product, ProductSpec $spec)
    {
        $this->authorizeProduct($product);

        if ($spec->product_id !== $product->id) {
            abort(403);
        }

        $spec->delete();

        return back()->with('success', 'Đã xóa thông số sản phẩm.');
    }

    //Kiểm tra quyền sở hữu sản phẩm
    protected function authorizeProduct(Product $product)
    {
        if ($product->created_by !== auth()->id()) {
            abort(403, 'Bạn không có quyền thao tác với sản phẩm này.');
        }
    }
}
