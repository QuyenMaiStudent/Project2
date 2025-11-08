<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Brand;
use App\Models\WarrantyPolicy;
use Cloudinary\Configuration\Configuration;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        // Chỉ xem sản phẩm do seller hiện tại tạo
        $products = Product::with(['brand', 'primaryImage', 'images'])
            ->where('created_by', auth()->id())
            ->orderByDesc('id')
            ->paginate(12);

        return Inertia::render('Products/ViewProduct', [
            'products' => $products
        ]);
    }

    public function create()
    {
        try {
            $brands = Brand::all();
            $warranties = WarrantyPolicy::all();

            Log::info('Create product page loaded', [
                'brands_count' => $brands->count(),
                'warranties_count' => $warranties->count(),
                'user_id' => auth()->id()
            ]);

            return Inertia::render('Products/AddProduct', [
                'brands' => $brands,
                'warranties' => $warranties
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create product page', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải trang: ' . $e->getMessage()]);
        }
    }

    public function store(Request $request)
    {
        Log::info('Product store started', [
            'user_id' => auth()->id(),
            'request_data' => $request->except(['image'])
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

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'stock' => 'required|integer|min:0',
                'brand_id' => 'required|exists:brands,id',
                'warranty_id' => 'nullable|exists:warranty_policies,id',
                'is_active' => 'boolean',
                'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            ]);

            Log::info('Validation passed');

            // server-side: disallow URLs and phone numbers in text inputs
            $checkFields = [
                'name' => $validated['name'] ?? '',
                'description' => $validated['description'] ?? '',
            ];
            
            foreach ($checkFields as $field => $value) {
                if ($this->containsUrlOrPhone((string)$value)) {
                    Log::warning('URL/Phone detected in field', ['field' => $field, 'value' => $value]);
                    throw ValidationException::withMessages([$field => 'Trường này không được chứa đường link hoặc số điện thoại.']);
                }
            }

            Log::info('Content validation passed');

            DB::beginTransaction();

            try {
                $product = Product::create([
                    'name' => $validated['name'],
                    'description' => $validated['description'] ?? null,
                    'price' => $validated['price'],
                    'stock' => $validated['stock'],
                    'brand_id' => $validated['brand_id'],
                    'warranty_id' => $validated['warranty_id'] ?? null,
                    'is_active' => $validated['is_active'] ?? true,
                    'created_by' => auth()->id(),
                    'status' => 'approved',
                ]);

                Log::info('Product created', ['product_id' => $product->id]);

                // Upload ảnh lên Cloudinary
                if ($request->hasFile('image')) {
                    Log::info('Starting image upload to Cloudinary');
                    
                    $file = $request->file('image');
                    Log::info('Image file details', [
                        'original_name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType(),
                        'path' => $file->getRealPath()
                    ]);
                    
                    // Sử dụng Cloudinary instance đúng cách
                    $cloudinary = new \Cloudinary\Cloudinary();
                    $result = $cloudinary->uploadApi()->upload($file->getRealPath(), [
                        'folder' => 'products',
                        'public_id' => 'product_' . $product->id . '_' . time(),
                        'transformation' => [
                            'width' => 800,
                            'height' => 600,
                            'crop' => 'limit',
                            'quality' => 'auto'
                        ]
                    ]);

                    $uploadedFileUrl = $result['secure_url'];
                    
                    Log::info('Image uploaded to Cloudinary', [
                        'url' => $uploadedFileUrl,
                        'public_id' => $result['public_id']
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'product_variant_id' => null,
                        'url' => $uploadedFileUrl,
                        'alt_text' => $product->name . ' - Ảnh đại diện',
                        'is_primary' => true,
                    ]);

                    Log::info('Product image saved to database');
                } else {
                    Log::warning('No image file uploaded');
                    throw new \Exception('No image file was uploaded.');
                }

                DB::commit();
                Log::info('Product creation completed successfully', ['product_id' => $product->id]);

                return redirect()->route('seller.products.index')->with('success', 'Sản phẩm đã được thêm thành công!');
                
            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Database transaction failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'line' => $e->getLine(),
                    'file' => $e->getFile()
                ]);
                throw $e;
            }

        } catch (ValidationException $e) {
            Log::warning('Validation failed', ['errors' => $e->errors()]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Product store failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'user_id' => auth()->id()
            ]);
            
            return back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage() . ' (Line: ' . $e->getLine() . ')'])->withInput();
        }
    }

    public function show(Product $product)
    {
        $product->load(['images', 'brand', 'seller', 'warrantyPolicy', 'variants', 'specs']);
        
        return Inertia::render('Products/ShowProduct', [
            'product' => $product
        ]);
    }

    public function edit(Product $product)
    {
        $this->authorizeProduct($product);

        $brands = Brand::all();
        $warranties = WarrantyPolicy::all();
        
        return view('products.edit', compact('product', 'brands', 'warranties'));
    }

    public function update(Request $request, Product $product)
    {
        $this->authorizeProduct($product);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'brand_id' => 'required|exists:brands,id',
            'warranty_id' => 'nullable|exists:warranty_policies,id',
            'is_active' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        // server-side: disallow URLs and phone numbers in text inputs
        $checkFields = [
            'name' => $validated['name'] ?? '',
            'description' => $validated['description'] ?? '',
        ];
        foreach ($checkFields as $field => $value) {
            if ($this->containsUrlOrPhone((string)$value)) {
                throw ValidationException::withMessages([$field => 'Trường này không được chứa đường link hoặc số điện thoại.']);
            }
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

            $product->update($validated);

            // nếu upload image -> thay ảnh chính
            if ($request->hasFile('image')) {
                // Xóa ảnh cũ trên Cloudinary
                $oldImage = \App\Models\ProductImage::where('product_id', $product->id)
                    ->where('is_primary', true)
                    ->first();
                
                if ($oldImage) {
                    // Extract public_id từ URL để xóa trên Cloudinary
                    $publicId = $this->getPublicIdFromUrl($oldImage->url);
                    if ($publicId) {
                        try {
                            $cloudinary = new \Cloudinary\Cloudinary();
                            $cloudinary->uploadApi()->destroy($publicId);
                        } catch (\Exception $e) {
                            Log::warning('Failed to delete old image from Cloudinary', ['error' => $e->getMessage()]);
                        }
                    }
                    $oldImage->delete();
                }

                // Upload ảnh mới
                $cloudinary = new \Cloudinary\Cloudinary();
                $result = $cloudinary->uploadApi()->upload($request->file('image')->getRealPath(), [
                    'folder' => 'products',
                    'public_id' => 'product_' . $product->id . '_' . time(),
                    'transformation' => [
                        'width' => 800,
                        'height' => 600,
                        'crop' => 'limit',
                        'quality' => 'auto'
                    ]
                ]);

                $uploadedFileUrl = $result['secure_url'];

                \App\Models\ProductImage::create([
                    'product_id' => $product->id,
                    'product_variant_id' => null,
                    'url' => $uploadedFileUrl,
                    'alt_text' => $product->name . ' - Ảnh đại diện',
                    'is_primary' => true,
                ]);
            }

            DB::commit();

            return redirect()->route('products.show', $product)->with('success', 'Sản phẩm đã được cập nhật!');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    public function destroy(Product $product)
    {
        $this->authorizeProduct($product);

        try {
            $product->delete();
            
            return redirect()->route('products.index')
                           ->with('success', 'Sản phẩm đã được xóa!');
                           
        } catch (\Exception $e) {
            return back()->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
        }
    }

    public function preview(Product $product)
    {
        $this->authorizeProduct($product);

        $product->load([
            'brand',
            'images',
            'specs',
            'variants',
        ]);

        return Inertia::render('Products/PreviewProduct', [
            'product' => $product
        ]);
    }

    public function submitForApproval(Product $product)
    {
        $this->authorizeProduct($product);

        if (
            $product->images()->count() === 0 ||
            $product->specs()->count() === 0 ||
            $product->variants()->count() === 0
        ) {
            return back()->with('error', 'Sản phẩm phải có ít nhất 1 ảnh, 1 thông số kỹ thuật và 1 biến thể trước khi gửi duyệt.');
        }

        // Seller action: mark approved immediately
        $product->update(['status' => 'approved']);

        return back()->with('success', 'Sản phẩm đã được đăng/duyệt thành công.');
    }

    /**
     * Simple heuristics to detect URLs or phone numbers inside text.
     * Returns true if forbidden content found.
     */
    private function containsUrlOrPhone(string $text): bool
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

    /**
     * Trích xuất public_id từ Cloudinary URL để xóa ảnh
     */
    private function getPublicIdFromUrl($url)
    {
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.ext
        if (preg_match('/\/v\d+\/(.+)\.\w+$/', $url, $matches)) {
            return $matches[1];
        }
        return null;
    }

    private function authorizeProduct(Product $product)
    {
        if ($product->created_by !== auth()->id()) {
            abort(403, 'Bạn không có quyền thao tác với sản phẩm này');
        }
    }
}