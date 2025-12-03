<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')->orderBy('id', 'desc')->paginate(10);
        return Inertia::render('Admin/Category', [
            'categories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:categories',
            'description' => 'nullable'
        ], [
            'name.required' => 'Vui long nhập tên danh mục.',
            'name.unique' => 'Tên danh mục đã tồn tại.',
        ]);

        Category::create($request->only('name', 'description'));
        return redirect()->route('admin.categories.index')->with('success', 'Thêm danh mục thành công!');
    }

    public function edit(Category $category)
    {
        return view('categories.edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        $request->validate([
            'name' => 'required|unique:categories,name,'.$category->id,
            'description' => 'nullable'
        ], [
            'name.required' => 'Vui long nhập tên danh mục.',
            'name.unique' => 'Tên danh mục đã tồn tại.',
        ]);

        $category->update($request->only('name', 'description'));
        return redirect()->route('admin.categories.index')->with('success', 'Cập nhật danh mục thành công!');
    }

    public function destroy(Category $category)
    {
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'Không thể xóa danh mục vì có sản phẩm liên quan.');
        }

        $category->delete();
        return redirect()->route('admin.categories.index')->with('success', 'Xóa danh mục thành công!');
    }
}
