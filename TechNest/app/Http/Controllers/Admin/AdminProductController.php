<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminProductController extends Controller
{
    // Quản lý danh sách sản phẩm (có thể filter theo seller)
    public function index(Request $request)
    {
        $query = Product::with(['brand', 'seller']);

        // THÊM: Filter theo tên sản phẩm (q)
        if ($request->filled('q')) {
            $query->where('name', 'like', '%' . $request->input('q') . '%');
        }

        if ($request->filled('seller')) {
            $query->where('created_by', $request->input('seller'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $products = $query->orderBy('created_at', 'desc')->paginate(12)->withQueryString();

        // Kiểm tra xem sản phẩm nào có trong giỏ hàng
        $productsIds = $products->pluck('id')->toArray();
        $productsInCart = CartItem::whereIn('product_id', $productsIds)
            ->pluck('product_id')
            ->unique()
            ->toArray();

        // Thêm thông tin có trong giỏ hàng vào từng sản phẩm
        $products->getCollection()->transform(function ($product) use ($productsInCart) {
            $product->is_in_cart = in_array($product->id, $productsInCart);
            return $product;
        });

        return Inertia::render('Admin/ManageProducts', [
            'products' => $products,
            'filters' => $request->only(['seller', 'status', 'q']), // THÊM: Bao gồm 'q'
        ]);
    }

    // Hiển thị chi tiết sản phẩm (giữ nguyên)
    public function show(Product $product)
    {
        $product->load([
            'brand',
            'images',
            'specs',
            'variants',
            'seller',
            'warrantyPolicy',
            'categories',
        ]);

        $allCategories = Category::all();
        return Inertia::render('Admin/ShowProduct', [
            'product' => $product,
            'allCategories' => $allCategories,
        ]);
    }

    // Cập nhật status sản phẩm trực tiếp (admin quản lý)
    public function updateStatus(Request $request, Product $product)
    {
        $request->validate([
            'status' => ['required', Rule::in(['draft','active','inactive','archived','approved','rejected'])],
        ]);

        // Kiểm tra xem sản phẩm có trong giỏ hàng không
        $isInCart = CartItem::where('product_id', $product->id)->exists();

        if ($isInCart) {
            return back()->withErrors(['status' => 'Không thể thay đổi trạng thái sản phẩm vì đang trong giỏ hàng của khách hàng']);
        }

        $product->update(['status' => $request->status]);

        return back()->with('success', 'Trạng thái sản phẩm đã được cập nhật.');
    }

    // Cập nhật category (giữ nguyên)
    public function updateCategories(Request $request, Product $product)
    {
        $request->validate([
            'categories' => 'array',
            'categories.*' => 'exists:categories,id',
        ], [
            'categories.*.exists' => 'Danh mục không hợp lệ.',
        ]);
        $product->categories()->sync($request->categories ?? []);
        return back()->with('success', 'Đã cập nhật danh mục cho sản phẩm!');
    }

    public function toggleActive(Request $request, Product $product)
    {
        $isInCart = CartItem::where('product_id', $product->id)->exists();

        if ($isInCart) {
            return response()->json(['error' => 'Không thể thay đổi trạng thái ẩn/hiện vì sản phẩm đang trong giỏ hàng của khách hàng'], 422);
        }

        $product->update(['is_active' => !$product->is_active]);

        // SỬA: Trả 204 No Content (không có body JSON)
        return response()->noContent();
    }

}