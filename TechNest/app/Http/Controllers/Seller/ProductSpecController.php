<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductSpec;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\ValidationException;

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

        // disallow URLs/phone in spec key/value
        foreach (['key','value'] as $f) {
            if ($this->containsUrlOrPhone($validated[$f])) {
                throw ValidationException::withMessages([$f => 'Không được chứa đường link hoặc số điện thoại.']);
            }
        }

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

        // disallow URLs/phone in spec key/value
        foreach (['key','value'] as $f) {
            if ($this->containsUrlOrPhone($validated[$f])) {
                throw ValidationException::withMessages([$f => 'Không được chứa đường link hoặc số điện thoại.']);
            }
        }

        $spec->update($validated);

        return back()->with('success', 'Đã cập nhật thông số sản phẩm.');
    }

    // reuse same detection heuristic
    protected function containsUrlOrPhone($text)
    {
        $t = trim($text);
        if ($t === '') return false;

        // Detect explicit URLs: http(s)://... or www.... or hostname.tld (require a dot + TLD)
        if (preg_match('/\b(https?:\/\/|www\.)[^\s]+/i', $t) ||
            preg_match('/\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i', $t)) {
            return true;
        }

        // Detect a contiguous digit sequence of length >= 7 (phone-like).
        // Use lookarounds to avoid matching digits that are part of alphanumeric tokens.
        if (preg_match('/(?<!\d)\d{7,}(?!\d)/', $t)) {
            return true;
        }

        return false;
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
