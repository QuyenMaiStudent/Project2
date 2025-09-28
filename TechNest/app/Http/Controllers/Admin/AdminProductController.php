<?php
namespace App\Http\Controllers\Admin\AdminProductController;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;

class AdminProductController extends Controller
{
    //Hiển thị danh sách sản phẩm chờ duyệt
    public function pending()
    {
        $products = Product::with(['brand', 'created_by'])
            ->where('status', 'pending')
            ->paginate(12);

        return Inertia::render('Admin/PendingProducts', [
            'products' => $products,
        ]);
    }

    //Duyệt sản phẩm
    public function approve(Product $product)
    {
        $product->update(['status' => 'approval']);
        return back()->with('success', 'Sản phẩm đã được duyệt.');
    }

    //Từ chối sản phẩm
    public function reject(Product $product)
    {
        $product->update(['status' => 'rejected']);
        return back()->with('success', 'Sản phẩm đã bị từ chối.');
    }
}