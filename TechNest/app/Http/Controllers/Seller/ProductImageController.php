<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ProductImageController extends Controller
{
    public function showUploadImages()
    {
        $products = Product::with('images')
            ->where('created_by', auth()->id())
            ->orderByDesc('id')
            ->paginate(6);

        return Inertia::render('Products/UploadImages', [
            'products' => $products
        ]);
    }

    public function uploadImages(Request $request, Product $product)
    {
        if ($product->created_by !== auth()->id()) {
            return back()->with(['error' => 'Bạn không có quyền thêm ảnh cho sản phẩm này']);
        }

        $validated = $request->validate([
            'images' => 'required|array|min:1|max:6',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        DB::beginTransaction();

        try {
            $uploadedCount = 0;

            foreach ($request->file('images') as $image) {
                $filename = 'product_' . $product->id . '_' . time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
                $image->storeAs('products', $filename, 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => '/storage/products/' . $filename,
                    'alt_text' => $product->name . ' - Ảnh' . ($uploadedCount + 1),
                    'is_primary' => false,
                ]);

                $uploadedCount++;
            }

            DB::commit();

            return back()->with('success', "Đã thêm {$uploadedCount} ảnh mới cho sản phẩm.");
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    public function deleteImage(ProductImage $image)
    {
        if ($image->product->created_by !== auth()->id()) {
            return back()->with('error', 'Bạn không có quyền xóa ảnh này');
        }

        if ($image->is_primary) {
            return back()->with('error', 'Không thể xóa ảnh chính của sản phẩm');
        }

        try {
            $imagePath = str_replace('/storage/', '', $image->url);
            if (file_exists(storage_path('app/public/' . $imagePath))) {
                unlink(storage_path('app/public/' . $imagePath));
            }

            $image->delete();

            return back()->with('success', 'Ảnh đã được xóa');
        } catch (\Exception $e) {
            return back()->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }
}
