<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    // Xem giỏ hàng
    public function index()
    {
        $cart = Cart::with(['items.product.primaryImage', 'items.variant'])->firstOrCreate(['user_id' => Auth::id()]);
        return Inertia::render('Cart/Index', [
            'cart' => [
                'id' => $cart->id,
                'items' => $cart->items->map(function ($item) {
                    // Lấy giá: nếu có variant thì lấy variant->price, không thì lấy product->price
                    $price = $item->variant
                        ? ($item->variant->price ?? $item->product->price)
                        : ($item->product->price ?? 0);

                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'image_url' => $item->product->primaryImage->url ?? null,
                            'price' => $price,
                        ] : null,
                        'variant' => $item->variant ? [
                            'id' => $item->variant->id,
                            'variant_name' => $item->variant->variant_name,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }

    // Thêm sản phẩm
    public function add(Request $request)
    {
        $product = Product::where('id', $request->product_id)
            ->where('is_active', true)
            ->where('status', 'approved')
            ->first();
        if (!$product) {
            return back()->withErrors(['msg' => "Sản phẩm không hợp lệ hoặc đã bị ẩn."]);
        }

        // Lấy variant nếu có
        $variant = null;
        if ($request->product_variant_id) {
            $variant = $product->variants()->where('id', $request->product_variant_id)->first();
            if (!$variant) {
                return back()->withErrors(['msg' => "Biến thể sản phẩm không hợp lệ."]);
            }
            $stock = $variant->stock;
        } else {
            $stock = $product->stock;
        }

        $cart = Cart::firstOrCreate(['user_id' => Auth::id()]);
        $item = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $request->product_id)
            ->where('product_variant_id', $request->product_variant_id)
            ->first();

        $currentQty = $item ? $item->quantity : 0;
        $addQty = $request->quantity ?? 1;
        $maxQty = max(0, $stock - 1);

        if ($currentQty + $addQty > $maxQty) {
            return back()->withErrors(['msg' => "Số lượng trong giỏ hàng không được vượt quá " . $maxQty . " sản phẩm!"]);
        }

        if ($item) {
            $item->quantity += $addQty;
            $item->save();
        } else {
            CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $request->product_id,
                'product_variant_id' => $request->product_variant_id,
                'quantity' => $addQty,
            ]);
        }

        return redirect()->route('cart.index')->with('success', 'Đã thêm vào giỏ hàng');
    }

    // Cập nhật số lượng
    public function update(Request $request, $id)
    {
        $item = CartItem::findOrFail($id);
        $item->update(['quantity' => $request->quantity]);
        return redirect()->route('cart.index')->with('success', 'Đã cập nhật giỏ hàng');
    }

    // Xóa sản phẩm
    public function destroy($id)
    {
        $item = CartItem::findOrFail($id);
        $item->delete();
        return redirect()->route('cart.index')->with('success', 'Đã xóa sản phẩm khỏi giỏ');
    }
}
