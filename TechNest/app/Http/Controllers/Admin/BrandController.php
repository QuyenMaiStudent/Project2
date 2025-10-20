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
        $brands = Brand::orderByDesc('id')->paginate(10);

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
            'brand' => $brand,
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

        // validate only fields that are present
        $rules = [
            'name' => ['sometimes', 'required', 'max:255', Rule::unique('brands', 'name')->ignore($brand->id)],
            'logo' => 'sometimes|nullable|image|max:2048',
            'logo_url' => 'sometimes|nullable|url',
            'description' => 'sometimes|nullable|string',
        ];

        $validated = $request->validate($rules);

        $data = [];

        // handle uploaded file (highest priority)
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('brands', 'public');

            // delete old local file if existed
            if ($brand->logo && !str_starts_with($brand->logo, 'http') && Storage::disk('public')->exists($brand->logo)) {
                Storage::disk('public')->delete($brand->logo);
            }

            $data['logo'] = $path;
        } elseif ($request->filled('logo_url')) {
            // switching to external URL
            if ($brand->logo && !str_starts_with($brand->logo, 'http') && Storage::disk('public')->exists($brand->logo)) {
                Storage::disk('public')->delete($brand->logo);
            }

            $data['logo'] = $request->input('logo_url');
        }

        // name (if sent)
        if ($request->has('name')) {
            // validated['name'] exists because of validation rule
            $data['name'] = $validated['name'];
        }

        // description (if sent) — allow clearing by sending empty string
        if ($request->has('description')) {
            $data['description'] = $validated['description'] ?? null;
        }

        if (!empty($data)) {
            $brand->update($data);
        }

        return redirect()->route('admin.brands.index')->with('success', 'Cập nhật thành công!');
    }

    public function destroy($id)
    {
        $brand = Brand::findOrFail($id);
        // delete local logo file if exists
        if ($brand->logo && !str_starts_with($brand->logo, 'http') && Storage::disk('public')->exists($brand->logo)) {
            Storage::disk('public')->delete($brand->logo);
        }
        $brand->delete();

        return redirect()->back()->with('success', 'Xóa thành công!');
    }
}
