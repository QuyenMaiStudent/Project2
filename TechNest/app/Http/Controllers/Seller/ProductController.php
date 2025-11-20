<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Brand;
use App\Models\Category;
use App\Models\WarrantyPolicy;
use Cloudinary\Cloudinary;
use Cloudinary\Configuration\Configuration;
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
            ->select(['id', 'name', 'price', 'stock', 'is_active', 'status', 'brand_id', 'created_by']) // Thêm status vào select
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
            $categories = Category::all(); // <-- added

            Log::info('Create product page loaded', [
                'brands_count' => $brands->count(),
                'warranties_count' => $warranties->count(),
                'categories_count' => $categories->count(), // <-- added
                'user_id' => auth()->id()
            ]);

            return Inertia::render('Products/AddProduct', [
                'brands' => $brands,
                'warranties' => $warranties,
                'categories' => $categories, // <-- added
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

            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                // 'stock' removed — stock will be computed from variants
                'brand_id' => 'required|exists:brands,id',
                'category_id' => 'required|exists:categories,id', // <-- added
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
                    // stock default to 0; will be updated when variants are added
                    'stock' => 0, // <-- changed
                    'brand_id' => $validated['brand_id'],
                    'warranty_id' => $validated['warranty_id'] ?? null,
                    'is_active' => $validated['is_active'] ?? true,
                    'created_by' => auth()->id(),
                    'status' => 'draft',
                ]);

                // Attach category qua pivot table
                $product->categories()->attach($validated['category_id']);

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
                    $cloudinary = new Cloudinary();
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

    // Thêm method để kiểm tra cart items
    public function checkCart(Product $product)
    {
        $this->authorizeProduct($product);

        $hasCartItems = $product->cartItems()->exists();

        return response()->json([
            'has_cart_items' => $hasCartItems
        ]);
    }

    // Thêm method để xóa cart items
    public function clearCartItems(Product $product)
    {
        $this->authorizeProduct($product);

        try {
            // Xóa CartItem của product này (bao gồm cả variants)
            $deletedCount = $product->cartItems()->delete();

            Log::info('Cart items cleared before edit', [
                'product_id' => $product->id,
                'deleted_count' => $deletedCount
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa sản phẩm khỏi giỏ hàng của khách hàng.'
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to clear cart items', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    public function edit(Product $product)
    {
        $this->authorizeProduct($product);

        try {
            $brands = Brand::all();
            $warranties = WarrantyPolicy::all();
            $categories = Category::all(); // Thêm categories

            // Load ảnh chính của sản phẩm
            $product->load(['brand', 'warrantyPolicy', 'primaryImage']);

            // Kiểm tra sản phẩm có trong giỏ hàng không
            $has_cart_items = $product->cartItems()->exists();

            Log::info('Edit product page loaded', [
                'product_id' => $product->id,
                'brands_count' => $brands->count(),
                'warranties_count' => $warranties->count(),
                'categories_count' => $categories->count(),
                'has_cart_items' => $has_cart_items,
                'user_id' => auth()->id()
            ]);

            return Inertia::render('Products/EditProduct', [
                'product' => $product,
                'brands' => $brands,
                'warranties' => $warranties,
                'categories' => $categories, // Thêm vào response
                'has_cart_items' => $has_cart_items,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading edit product page', [
                'error' => $e->getMessage(),
                'product_id' => $product->id,
            ]);

            return back()->withErrors(['error' => 'Có lỗi xảy ra khi tải trang: ' . $e->getMessage()]);
        }
    }

    public function update(Request $request, Product $product)
    {
        $this->authorizeProduct($product);

        Log::info('Product update started', [
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'request_data' => $request->all(),
        ]);

        try {
            // Validate input - removed stock from product update (stock computed from variants)
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                // 'stock' removed
                'brand_id' => 'required|integer|exists:brands,id',
                'category_id' => 'nullable|integer|exists:categories,id',
                'warranty_id' => 'nullable|integer|exists:warranty_policies,id',
                'is_active' => 'sometimes|boolean',
                'confirmed' => 'sometimes|boolean', // Thêm để kiểm tra xác nhận
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:4096',
            ]);

            // Đảm bảo is_active có giá trị
            if (!isset($validated['is_active'])) {
                $validated['is_active'] = false;
            }

            Log::info('Update validation passed', ['validated_data' => $validated]);

            // Kiểm tra URL/Phone trong các trường text
            $checkFields = [
                'name' => $validated['name'] ?? '',
                'description' => $validated['description'] ?? '',
            ];
            
            foreach ($checkFields as $field => $value) {
                if ($this->containsUrlOrPhone((string)$value)) {
                    Log::warning('URL/Phone detected in field', ['field' => $field, 'value' => $value]);
                    throw ValidationException::withMessages([
                        $field => 'Trường này không được chứa đường link hoặc số điện thoại.'
                    ]);
                }
            }

            Log::info('Content validation passed');

            // Kiểm tra nếu sản phẩm có trong giỏ hàng và chưa xác nhận
            if (!$request->input('confirmed', false) && $product->cartItems()->exists()) {
                return back()->withErrors([
                    'confirm' => 'Sản phẩm hiện tại có trong giỏ hàng của một số khách hàng. Thao tác này sẽ loại bỏ các sản phẩm trong giỏ hàng của khách hàng. Bạn có chắc muốn thực hiện thao tác này?'
                ])->withInput();
            }

            DB::beginTransaction();

            try {
                // Nếu đã xác nhận, xóa các CartItem liên quan (bao gồm của product_variant thuộc sản phẩm)
                if ($request->input('confirmed', false)) {
                    // Xóa CartItem của product này (và variants nếu có)
                    $product->cartItems()->delete();
                    Log::info('Cart items deleted for product update', ['product_id' => $product->id]);
                }

                // Chuẩn bị dữ liệu để update (stock removed)
                $updateData = [
                    'name' => $validated['name'],
                    'description' => $validated['description'],
                    'price' => (float) $validated['price'],
                    'brand_id' => (int) $validated['brand_id'],
                    'warranty_id' => $validated['warranty_id'] ? (int) $validated['warranty_id'] : null,
                    'is_active' => (bool) $validated['is_active'],
                ];

                // optionally update category if provided
                if (array_key_exists('category_id', $validated)) {
                    $updateData['category_id'] = $validated['category_id'] ? (int) $validated['category_id'] : null;
                }

                // Chỉ update những trường thay đổi
                $hasChanges = false;
                $changes = [];
                
                foreach ($updateData as $key => $newValue) {
                    $oldValue = $product->$key;
                    
                    // So sánh giá trị (chú ý kiểu dữ liệu)
                    if ($key === 'price') {
                        $oldValue = (float) $oldValue;
                        $newValue = (float) $newValue;
                    } elseif (in_array($key, ['stock', 'brand_id', 'warranty_id'])) {
                        $oldValue = (int) $oldValue;
                        $newValue = $newValue ? (int) $newValue : null;
                    } elseif ($key === 'is_active') {
                        $oldValue = (bool) $oldValue;
                        $newValue = (bool) $newValue;
                    }
                    
                    if ($oldValue !== $newValue) {
                        $hasChanges = true;
                        $changes[$key] = ['old' => $oldValue, 'new' => $newValue];
                    }
                }

                if ($hasChanges) {
                    $product->update($updateData);
                    Log::info('Product data updated', [
                        'product_id' => $product->id,
                        'changes' => $changes
                    ]);
                }

                // Sync category nếu có thay đổi
                if (array_key_exists('category_id', $validated) && $validated['category_id'] !== null) {
                    $product->categories()->sync([$validated['category_id']]);
                    Log::info('Product category updated', [
                        'product_id' => $product->id,
                        'new_category_id' => $validated['category_id']
                    ]);
                    $hasChanges = true;
                }

                // Xử lý upload ảnh mới nếu có
                if ($request->hasFile('image')) {
                    Log::info('Starting image update');
                    
                    // Cấu hình Cloudinary
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
                    
                    // Xóa ảnh cũ trên Cloudinary và database
                    $oldImage = ProductImage::where('product_id', $product->id)
                        ->where('is_primary', true)
                        ->first();
                    
                    if ($oldImage) {
                        // Extract public_id từ URL để xóa trên Cloudinary
                        $publicId = $this->getPublicIdFromUrl($oldImage->url);
                        if ($publicId) {
                            try {
                                $cloudinary = new Cloudinary();
                                $cloudinary->uploadApi()->destroy($publicId);
                                Log::info('Old image deleted from Cloudinary', ['public_id' => $publicId]);
                            } catch (\Exception $e) {
                                Log::warning('Failed to delete old image from Cloudinary', [
                                    'error' => $e->getMessage()
                            ]);
                            }
                        }
                        $oldImage->delete();
                    }

                    // Upload ảnh mới lên Cloudinary
                    $file = $request->file('image');
                    Log::info('Uploading new image', [
                        'original_name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'mime_type' => $file->getMimeType()
                    ]);
                    
                    $cloudinary = new Cloudinary();
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

                    // Lưu ảnh mới vào database
                    ProductImage::create([
                        'product_id' => $product->id,
                        'product_variant_id' => null,
                        'url' => $uploadedFileUrl,
                        'alt_text' => $product->name . ' - Ảnh đại diện',
                        'is_primary' => true,
                    ]);

                    Log::info('New image uploaded and saved', [
                        'url' => $uploadedFileUrl,
                        'public_id' => $result['public_id']
                    ]);

                    $hasChanges = true;
                }

                DB::commit();

                if ($hasChanges) {
                    Log::info('Product update completed successfully', [
                        'product_id' => $product->id,
                        'changes_made' => $hasChanges
                    ]);
                    
                    return redirect()->route('seller.products.index')
                        ->with('success', 'Sản phẩm đã được cập nhật thành công!');
                } else {
                    Log::info('No changes detected, redirecting without update', [
                        'product_id' => $product->id
                    ]);
                    
                    return redirect()->route('seller.products.index')
                        ->with('info', 'Không có thay đổi nào được phát hiện.');
                }
                
            } catch (\Exception $e) {
                DB::rollback();
                Log::error('Database transaction failed during update', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                    'product_id' => $product->id
                ]);
                throw $e;
            }

        } catch (ValidationException $e) {
            Log::warning('Update validation failed', [
                'errors' => $e->errors(),
                'product_id' => $product->id
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Product update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'product_id' => $product->id,
                'user_id' => auth()->id()
            ]);
            
            return back()
                ->withErrors(['error' => 'Có lỗi xảy ra khi cập nhật sản phẩm: ' . $e->getMessage()])
                ->withInput();
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

        // Kiểm tra điều kiện bắt buộc
        if (
            $product->images()->count() === 0 ||
            $product->specs()->count() === 0 ||
            $product->variants()->count() === 0
        ) {
            return back()->with('error', 'Sản phẩm phải có ít nhất 1 ảnh, 1 thông số kỹ thuật và 1 biến thể trước khi gửi duyệt.');
        }

        // Kiểm tra trạng thái hiện tại
        if ($product->status === 'approved') {
            return back()->with('info', 'Sản phẩm đã được đăng trước đó.');
        }

        // Cập nhật status thành approved
        $product->update(['status' => 'approved']);

        Log::info('Product submitted for approved', [
            'product_id' => $product->id,
            'user_id' => auth()->id(),
            'old_status' => 'draft',
            'new_status' => 'approved'
        ]);

        return back()->with('success', 'Sản phẩm đã được đăng/duyệt thành công.');
    }

    /**
     * Kiểm tra URL hoặc số điện thoại trong text
     */
    private function containsUrlOrPhone(string $text): bool
    {
        $t = trim($text);
        if ($t === '') return false;

        // Phát hiện URL: http(s)://... hoặc www.... hoặc domain.tld
        if (preg_match('/\b(https?:\/\/|www\.)[^\s]+/i', $t) ||
            preg_match('/\b[a-z0-9\-]+\.[a-z]{2,63}(\b|\/)/i', $t)) {
            return true;
        }

        // Phát hiện số điện thoại (chuỗi số >= 7 chữ số liên tiếp)
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

    public function toggleVisibility(Product $product)
    {
        $this->authorizeProduct($product);

        // Chỉ cho phép toggle với sản phẩm đã approved
        if ($product->status !== 'approved') {
            return response()->json([
                'success' => false,
                'message' => 'Chỉ có thể ẩn/hiện sản phẩm đã được đăng.'
            ], 400);
        }

        try {
            $product->update(['is_active' => !$product->is_active]);

            Log::info('Product visibility toggled', [
                'product_id' => $product->id,
                'new_is_active' => $product->is_active,
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'success' => true,
                'is_active' => $product->is_active,
                'message' => $product->is_active ? 'Sản phẩm đã được hiển thị.' : 'Sản phẩm đã được ẩn.' 
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to toggle product visibility', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}