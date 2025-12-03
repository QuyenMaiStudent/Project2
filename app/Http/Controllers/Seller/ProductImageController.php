<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
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
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        DB::beginTransaction();

        try {
            // Upload lên Cloudinary
            $uploadedFileUrl = Cloudinary::upload($request->file('image')->getRealPath(), [
                'folder' => 'products',
                'public_id' => 'product_' . $product->id . '_' . time(),
                'transformation' => [
                    'width' => 800,
                    'height' => 600,
                    'crop' => 'limit',
                    'quality' => 'auto'
                ]
            ])->getSecurePath();

            // unset primary others
            ProductImage::where('product_id', $product->id)->update(['is_primary' => false]);

            ProductImage::create([
                'product_id' => $product->id,
                'product_variant_id' => null,
                'url' => $uploadedFileUrl,
                'alt_text' => $product->name . ' - Ảnh đại diện',
                'is_primary' => true,
            ]);

            DB::commit();

            return back()->with('success', 'Ảnh đại diện đã được cập nhật.');
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
            // Xóa trên Cloudinary
            $publicId = $this->getPublicIdFromUrl($image->url);
            if ($publicId) {
                Cloudinary::destroy($publicId);
            }

            $image->delete();

            return back()->with('success', 'Ảnh đã được xóa');
        } catch (\Exception $e) {
            return back()->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    private function getPublicIdFromUrl($url)
    {
        if (preg_match('/\/v\d+\/(.+)\.\w+$/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }
}
