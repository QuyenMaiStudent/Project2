<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BrandController extends Controller
{
    // Hiển thị danh sách thương hiệu
    public function index()
{
    $brands = Brand::orderByDesc('id')->paginate(10);

    return Inertia::render('Admin/brands/index', [
        'brands' => $brands,
    ]);
}

public function create()
{
    return Inertia::render('Admin/brands/create');
}

public function store(Request $request)
{
    $request->validate([
        'name' => 'required|max:255|unique:brands,name',
    ]);

    Brand::create([
        'name' => $request->name,
        'status' => $request->has('status') ? 1 : 0,
    ]);

    return redirect()->route('admin.brands.index')->with('success', 'Thêm thương hiệu thành công!');
}

public function edit($id)
{
    $brand = Brand::findOrFail($id);
    return Inertia::render('Admin/brands/edit', ['brand' => $brand]);
}

public function update(Request $request, $id)
{
    $brand = Brand::findOrFail($id);
    $request->validate([
        'name' => 'required|max:255|unique:brands,name,' . $id,
    ]);
    $brand->update([
        'name' => $request->name,
        'status' => $request->has('status') ? 1 : 0,
    ]);
    return redirect()->route('admin.brands.index')->with('success', 'Cập nhật thành công!');
}

public function destroy($id)
{
    Brand::findOrFail($id)->delete();
    return redirect()->back()->with('success', 'Xóa thành công!');
}

public function toggleStatus($id)
{
    $brand = Brand::findOrFail($id);
    $brand->status = !$brand->status;
    $brand->save();

    return redirect()->route('admin.brands.index');
}
}