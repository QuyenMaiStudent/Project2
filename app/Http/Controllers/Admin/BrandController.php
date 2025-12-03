<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BrandController extends Controller
{
    // Hiển thị danh sách thương hiệu
    public function index()
    {
        $brands = Brand::withCount('products')->orderByDesc('id')->paginate(10);

        $brands->getCollection()->transform(function ($brand) {
            $brand->has_products = $brand->products_count > 0;
            return $brand;
        });

        return Inertia::render('Admin/Brands/Index', [
            'brands' => $brands,
            'breadcrumbs' => [
                ['title' => 'Trang quản trị', 'href' => '/admin/dashboard'],
                ['title' => 'Quản lý thương hiệu', 'href' => '/admin/brands'],
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Brands/Create', [
            'breadcrumbs' => [
                ['title' => 'Trang quản trị', 'href' => '/admin/dashboard'],
                ['title' => 'Quản lý thương hiệu', 'href' => '/admin/brands'],
                ['title' => 'Thêm', 'href' => '/admin/brands/create'],
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|max:255|unique:brands,name',
            'logo' => 'nullable|image|max:2048', // 2MB
            'logo_url' => 'nullable|url',
            'description' => 'nullable|string',
        ]);

        // prefer uploaded file over URL if both provided
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');
            $logoValue = $path; // store path under storage/app/public
        } elseif (!empty($validated['logo_url'])) {
            $logoValue = $validated['logo_url'];
        } else {
            $logoValue = null;
        }

        Brand::create([
            'name' => $validated['name'],
            'logo' => $logoValue,
            'description' => $validated['description'] ?? null,
        ]);

        return redirect()->route('admin.brands.index')->with('success', 'Thêm thương hiệu thành công!');
    }

    public function edit($id)
    {
        $brand = Brand::findOrFail($id);

        return Inertia::render('Admin/Brands/Edit', [
            'brand' => [
                'id' => $brand->id,
                'name' => $brand->name,
                'logo' => $brand->logo,
                'description' => $brand->description,
                // Thêm các trường khác nếu cần
            ],
            'breadcrumbs' => [
                ['title' => 'Trang quản trị', 'href' => '/admin/dashboard'],
                ['title' => 'Quản lý thương hiệu', 'href' => '/admin/brands'],
                ['title' => 'Chỉnh sửa', 'href' => "/admin/brands/{$id}/edit"],
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $brand = Brand::findOrFail($id);

        // Chỉ validate khi có trong request (không bắt buộc)
        $validated = $request->validate([
            'name' => ['nullable', 'string', 'max:255', Rule::unique('brands')->ignore($brand->id)],
            'logo' => 'nullable|image|max:2048',
            'logo_url' => 'nullable|url',
            'description' => 'nullable|string',
        ]);

        // Tạo mảng để lưu các giá trị sẽ cập nhật
        $updateData = [];

        // Xử lý tên nếu được cung cấp
        if ($request->has('name') && !empty($request->name)) {
            $updateData['name'] = $request->name;
        }

        // Xử lý mô tả - cho phép xóa (empty string)
        if ($request->has('description')) {
            $updateData['description'] = $request->description;
        }

        // Xử lý logo - file upload ưu tiên
        if ($request->hasFile('logo')) {
            // Xóa file logo cũ nếu tồn tại và là file local
            if ($brand->logo && !str_starts_with($brand->logo, 'http') && Storage::disk('public')->exists($brand->logo)) {
                Storage::disk('public')->delete($brand->logo);
            }
            
            // Lưu file mới
            $path = $request->file('logo')->store('brands', 'public');
            $updateData['logo'] = $path;
        } 
        // Xử lý logo_url nếu được cung cấp và không có file upload
        elseif ($request->filled('logo_url')) {
            // Xóa file logo cũ nếu tồn tại và là file local
            if ($brand->logo && !str_starts_with($brand->logo, 'http') && Storage::disk('public')->exists($brand->logo)) {
                Storage::disk('public')->delete($brand->logo);
            }
            
            $updateData['logo'] = $request->logo_url;
        }

        // Cập nhật nếu có dữ liệu
        if (!empty($updateData)) {
            $brand->update($updateData);
        }

        return redirect()->route('admin.brands.index')->with('success', 'Cập nhật thành công!');
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);

        // Kiểm tra nếu brand đã có sản phẩm liên quan, không cho phép xóa
        if ($brand->products()->count() > 0) {
            return redirect()->back()->with('error', 'Không thể xóa thương hiệu vì đã có sản phẩm liên quan!');
        }

        // delete local logo file if exists
        if ($brand->logo && !str_starts_with($brand->logo, 'http') && Storage::disk('public')->exists($brand->logo)) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();

        return redirect()->back()->with('success', 'Xóa thành công!');
    }
}
