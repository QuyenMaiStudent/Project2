<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Brand;
use App\Models\WarrantyPolicy;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Support\Facades\DB;
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
        $brands = Brand::all();
        $warranties = WarrantyPolicy::all();

        return Inertia::render('Products/AddProduct', [
            'brands' => $brands,
            'warranties' => $warranties
        ]);
    }

    public function store(Request $request)
    {
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

        DB::beginTransaction();

        try {
            // Tạo sản phẩm
            $product = Product::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'price' => $validated['price'],
                'stock' => $validated['stock'],
                'brand_id' => $validated['brand_id'],
                'warranty_id' => $validated['warranty_id'] ?? null,
                'is_active' => $validated['is_active'] ?? true,
                'created_by' => auth()->id(),
            ]);

            // Lưu ảnh vào public/products
            if ($request->hasFile('image')) {
                $file = $request->file('image');
                $filename = 'product_' . $product->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('products', $filename, 'public');

                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => '/storage/products/' . $filename,
                    'alt_text' => $product->name . ' - Ảnh đại diện',
                    'is_primary' => true,
                ]);
            }

            DB::commit();

            return redirect()->route('seller.products.index')
                ->with('success', 'Sản phẩm đã được thêm thành công!');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()]);
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
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:4096',
        ]);

        DB::beginTransaction();
        
        try {
            $product->update($validated);

            // Nếu có ảnh mới, upload lên Cloudinary
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $image) {
                    $uploaded = Cloudinary::upload($image->getRealPath(), [
                        'folder' => 'technest/products',
                        'public_id' => 'product_' . $product->id . '_' . uniqid(),
                        'transformation' => [
                            'quality' => 'auto',
                            'fetch_format' => 'auto',
                            'width' => 800,
                            'height' => 600,
                            'crop' => 'fit'
                        ]
                    ]);

                    ProductImage::create([
                        'product_id' => $product->id,
                        'url' => $uploaded->getSecurePath(),
                        'alt_text' => $product->name . ' - Ảnh mới',
                        'is_primary' => false,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('products.show', $product)
                           ->with('success', 'Sản phẩm đã được cập nhật!');

        } catch (\Exception $e) {
            DB::rollback();
            
            return back()->withInput()
                        ->with('error', 'Có lỗi xảy ra: ' . $e->getMessage());
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

        $product->update(['status' => 'pending']);

        return back()->with('success', 'Sản phẩm đã được gửi duyệt thành công và đang chờ xét duyệt.');
    }

    private function authorizeProduct(Product $product)
    {
        if ($product->created_by !== auth()->id()) {
            abort(403, 'Bạn không có quyền thao tác với sản phẩm này');
        }
    }
}