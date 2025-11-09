<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Cloudinary\Configuration\Configuration;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductVariantController extends Controller
{
    //Hiển thị danh sách biến thể của sản phẩm
    public function index (Product $product)
    {
        $this->authorizeProduct($product);

        // Ensure we load the related image and expose a convenient image_url for the frontend
        $variants = $product->variants()->with('image')->get()->map(function ($v) {
            $arr = $v->toArray();
            $arr['image_url'] = optional($v->image)->url ?? null;
            return $arr;
        });

        return Inertia::render('Products/ProductVariants', [
            'product' => $product,
            'variants' => $variants,
        ]);
    }

    //Thêm mới biến thể
    public function store (Request $request, Product $product)
    {
        $this->authorizeProduct($product);

        $validated = $request->validate([
            'variant_name' => 'required|string|max:255',
            'additional_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        // disallow URLs/phone in variant name
        if ($this->containsUrlOrPhone($validated['variant_name'])) {
            throw ValidationException::withMessages(['variant_name' => 'Tên biến thể không được chứa đường link hoặc số điện thoại.']);
        }

        DB::beginTransaction();
        try {
            // Manual set Cloudinary configuration
            Configuration::instance([
                'cloud' => [
                    'cloud_name' => 'dkjqdzofj',
                    'api_key' => '762956796349914',
                    'api_secret' => 'JHTu010RMfNo4WJPQxs1j6UqQLg'
                ],
                'url' => [
                    'secure' => true
                ]
            ]);

            $variant = $product->variants()->create([
                'variant_name' => $validated['variant_name'],
                'additional_price' => $validated['additional_price'],
                'stock' => $validated['stock'],
            ]);

            if ($request->hasFile('image')) {
                Log::info('Starting variant image upload to Cloudinary', [
                    'variant_id' => $variant->id,
                    'product_id' => $product->id
                ]);
                
                $file = $request->file('image');
                
                // Sử dụng Cloudinary instance đúng cách như ProductController
                $cloudinary = new \Cloudinary\Cloudinary();
                $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                    'folder' => 'products/variants',
                    'public_id' => 'variant_' . $variant->id . '_' . time(),
                    'transformation' => [
                        'width' => 600,
                        'height' => 600,
                        'crop' => 'limit',
                        'quality' => 'auto'
                    ]
                ]);

                $uploadedFileUrl = $result['secure_url'];
                
                Log::info('Variant image uploaded to Cloudinary', [
                    'url' => $uploadedFileUrl,
                    'public_id' => $result['public_id']
                ]);

                ProductImage::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'url' => $uploadedFileUrl,
                    'alt_text' => $product->name . ' - ' . $variant->variant_name,
                    'is_primary' => false,
                ]);
            }

            DB::commit();
            return back()->with('success', 'Đã thêm biến thể sản phẩm.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to create product variant', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'product_id' => $product->id
            ]);
            return back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    //Sửa
    public function update (Request $request, Product $product, ProductVariant $variant)
    {
        $this->authorizeProduct($product);

        if ($variant->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'variant_name' => 'required|string|max:255',
            'additional_price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        // disallow URLs/phone in variant name
        if ($this->containsUrlOrPhone($validated['variant_name'])) {
            throw ValidationException::withMessages(['variant_name' => 'Tên biến thể không được chứa đường link hoặc số điện thoại.']);
        }

        DB::beginTransaction();
        try {
            // Manual set Cloudinary configuration
            \Cloudinary\Configuration\Configuration::instance([
                'cloud' => [
                    'cloud_name' => 'dkjqdzofj',
                    'api_key' => '762956796349914',
                    'api_secret' => 'JHTu010RMfNo4WJPQxs1j6UqQLg'
                ],
                'url' => [
                    'secure' => true
                ]
            ]);

            $variant->update([
                'variant_name' => $validated['variant_name'],
                'additional_price' => $validated['additional_price'],
                'stock' => $validated['stock'],
            ]);

            if ($request->hasFile('image')) {
                // Xóa ảnh cũ trên Cloudinary
                $old = ProductImage::where('product_variant_id', $variant->id)->first();
                if ($old) {
                    $publicId = $this->getPublicIdFromUrl($old->url);
                    if ($publicId) {
                        try {
                            $cloudinary = new \Cloudinary\Cloudinary();
                            $cloudinary->uploadApi()->destroy($publicId);
                        } catch (\Exception $e) {
                            Log::warning('Failed to delete old variant image from Cloudinary', ['error' => $e->getMessage()]);
                        }
                    }
                    $old->delete();
                }

                // Upload ảnh mới
                $cloudinary = new \Cloudinary\Cloudinary();
                $result = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'products/variants',
                    'public_id' => 'variant_' . $variant->id . '_' . time(),
                    'transformation' => [
                        'width' => 600,
                        'height' => 600,
                        'crop' => 'limit',
                        'quality' => 'auto'
                    ]
                ]);

                $uploadedFileUrl = $result['secure_url'];

                ProductImage::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'url' => $uploadedFileUrl,
                    'alt_text' => $product->name . ' - ' . $variant->variant_name,
                    'is_primary' => false,
                ]);
            }

            DB::commit();
            return back()->with('success', 'Đã cập nhật biến thể sản phẩm.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Failed to update product variant', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'variant_id' => $variant->id
            ]);
            return back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
        }
    }

    //Xóa
    public function destroy (Product $product, ProductVariant $variant)
    {
        $this->authorizeProduct($product);

        if ($variant->product_id !== $product->id) {
            abort(403);
        }

        try {
            // Xóa ảnh trên Cloudinary trước khi xóa variant
            $image = ProductImage::where('product_variant_id', $variant->id)->first();
            if ($image) {
                $publicId = $this->getPublicIdFromUrl($image->url);
                if ($publicId) {
                    try {
                        \Cloudinary\Configuration\Configuration::instance([
                            'cloud' => [
                                'cloud_name' => 'dkjqdzofj',
                                'api_key' => '762956796349914',
                                'api_secret' => 'JHTu010RMfNo4WJPQxs1j6UqQLg'
                            ],
                            'url' => [
                                'secure' => true
                            ]
                        ]);
                        
                        $cloudinary = new \Cloudinary\Cloudinary();
                        $cloudinary->uploadApi()->destroy($publicId);
                    } catch (\Exception $e) {
                        Log::warning('Failed to delete variant image from Cloudinary', ['error' => $e->getMessage()]);
                    }
                }
                $image->delete();
            }

            $variant->delete();

            return back()->with('success', 'Đã xóa biến thể sản phẩm.');
        } catch (\Exception $e) {
            Log::error('Failed to delete product variant', [
                'error' => $e->getMessage(),
                'variant_id' => $variant->id
            ]);
            return back()->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    //Hàm kiểm tra quyền sở hữu sản phẩm
    private function authorizeProduct (Product $product)
    {
        if ($product->created_by !== auth()->id()) {
            abort(403, "Bạn không có quyền thao tác với sản phẩm này.");
        }
    }

    public function uploadImages(Request $request, Product $product, ProductVariant $variant)
    {
        $this->authorizeProduct($product);

        if ($variant->product_id !== $product->id) {
            abort(403);
        }

        $validated = $request->validate([
            'images' => 'required|array|min:1|max:6',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        try {
            // Manual set Cloudinary configuration
            \Cloudinary\Configuration\Configuration::instance([
                'cloud' => [
                    'cloud_name' => 'dkjqdzofj',
                    'api_key' => '762956796349914',
                    'api_secret' => 'JHTu010RMfNo4WJPQxs1j6UqQLg'
                ],
                'url' => [
                    'secure' => true
                ]
            ]);

            foreach ($validated['images'] as $image) {
                $cloudinary = new \Cloudinary\Cloudinary();
                $result = $cloudinary->uploadApi()->upload($image->getRealPath(), [
                    'folder' => 'products/variants',
                    'public_id' => 'variant_' . $variant->id . '_' . time() . '_' . uniqid(),
                    'transformation' => [
                        'width' => 600,
                        'height' => 600,
                        'crop' => 'limit',
                        'quality' => 'auto'
                    ]
                ]);

                $uploadedFileUrl = $result['secure_url'];

                ProductImage::create([
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'url' => $uploadedFileUrl,
                    'alt_text' => $product->name . ' - ' . $variant->variant_name,
                    'is_primary' => false,
                ]);
            }

            return back()->with('success', 'Đã thêm ảnh cho biến thể.');
        } catch (\Exception $e) {
            Log::error('Failed to upload variant images', [
                'error' => $e->getMessage(),
                'variant_id' => $variant->id
            ]);
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

    private function containsUrlOrPhone($text)
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
}
