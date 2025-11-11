<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CartController extends Controller
{
    // Xem giỏ hàng
    public function index()
    {
        // Tải ảnh chính của sản phẩm và ảnh của biến thể (nếu có), tạo giỏ nếu chưa tồn tại cho user hiện tại
        $cart = Cart::with(['items.product.primaryImage', 'items.variant.image'])->firstOrCreate(['user_id' => Auth::id()]);

        return Inertia::render('Cart/Index', [
            'cart' => [
                'id' => $cart->id,
                'items' => $cart->items->map(function ($item) {
                    $product = $item->product;
                    $variant = $item->variant;

                    // Tính giá: nếu biến thể có trường price thì dùng nó,
                    // nếu không thì cộng additional_price vào price của product
                    $basePrice = $product->price ?? 0;
                    if ($variant) {
                        $variantPrice = $variant->price ?? null;
                        if ($variantPrice !== null) {
                            $price = $variantPrice;
                        } else {
                            $price = $basePrice + ($variant->additional_price ?? 0);
                        }
                    } else {
                        $price = $basePrice;
                    }

                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'product' => $product ? [
                            'id' => $product->id,
                            'name' => $product->name,
                            'image_url' => $product->primaryImage->url ?? null,
                            // gửi price cuối cùng trong product để frontend dễ hiển thị
                            'price' => $price,
                        ] : null,
                        'variant' => $variant ? [
                            'id' => $variant->id,
                            'variant_name' => $variant->variant_name,
                            'image_url' => optional($variant->image)->url ?? null,
                        ] : null,
                    ];
                }),
            ],
        ]);
    }

    // Thêm sản phẩm vào giỏ
    public function add(Request $request)
    {
        // Xử lý request Inertia hoặc AJAX/JSON như API (không redirect)
        $isInertia = $request->header('X-Inertia') !== null;
        $expectsJson = $request->wantsJson() || $request->expectsJson();
        $api = $isInertia || $expectsJson;

        $product = Product::where('id', $request->product_id)
            ->where('is_active', true)
            ->where('status', 'approved')
            ->first();

        if (!$product) {
            if ($api) {
                return response()->json(['success' => false, 'message' => "Sản phẩm không hợp lệ hoặc đã bị ẩn"], 422);
            }
            return back()->withErrors(['msg' => "Sản phẩm không hợp lệ hoặc đã bị ẩn."]);
        }

        // Lấy biến thể (variant) nếu có
        $variant = null;
        if ($request->product_variant_id) {
            $variant = $product->variants()->where('id', $request->product_variant_id)->first();
            if (!$variant) {
                if ($api) {
                    return response()->json(['success' => false, 'message' => "Biến thể sản phẩm không hợp lệ."], 422);
                }
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
            $msg = "Số lượng trong giỏ hàng không được vượt quá " . $maxQty . " sản phẩm.";
            if ($api) {
                return response()->json(['success' => false, 'message' => $msg], 422);
            }
            return back()->withErrors(['msg' => $msg]);
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

        if ($api) {
            $cartCount = (int) CartItem::where('cart_id', $cart->id)->sum('quantity');
            return response()->json(['success' => true, 'cartCount' => $cartCount], 200);
        }

        return redirect()->route('cart.index')->with('success', 'Đã thêm vào giỏ hàng');
    }

    // Cập nhật số lượng trong giỏ hàng
    public function update(Request $request, $id)
    {
        $item = CartItem::findOrFail($id);
        $item->update(['quantity' => $request->quantity]);
        return redirect()->route('cart.index')->with('success', 'Đã cập nhật giỏ hàng');
    }

    // Xóa sản phẩm khỏi giỏ
    public function destroy($id)
    {
        $item = CartItem::findOrFail($id);
        $item->delete();
        return redirect()->route('cart.index')->with('success', 'Đã xóa sản phẩm khỏi giỏ');
    }

    // Xóa tất cả sản phẩm khỏi giỏ
    public function clearAll(Request $request)
    {
        $isInertia = $request->header('X-Inertia') !== null;
        $expectsJson = $request->wantsJson() || $request->expectsJson();

        $userId = Auth::id();
        if (!$userId) {
            if ($expectsJson) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }
            return redirect()->route('login');
        }

        $cart = Cart::where('user_id', $userId)->first();
        if (!$cart) {
            if ($isInertia) {
                return redirect()->route('cart.index')->with('success', 'Giỏ hàng đã rỗng');
            }
            if ($expectsJson) {
                return response()->json(['success' => true, 'cartCount' => 0], 200);
            }
            return redirect()->route('cart.index')->with('success', 'Giỏ hàng đã rỗng');
        }

        try {
            $itemModel = $cart->items()->getModel();
            $uses = class_uses($itemModel);
            if (in_array(SoftDeletes::class, $uses ?: [])) {
                $cart->items()->forceDelete();
            } else {
                $cart->items()->delete();
            }
        } catch (\Exception $e) {
            if ($expectsJson) {
                return response()->json(['success' => false, 'message' => 'Không thể xóa: ' . $e->getMessage()], 500);
            }
            return back()->withErrors(['msg' => 'Không thể xóa giỏ hàng: ' . $e->getMessage()]);
        }

        // Trả redirect với flash cho Inertia, JSON chỉ cho AJAX/JSON requests
        if ($isInertia) {
            return redirect()->route('cart.index')->with('success', 'Đã xóa tất cả sản phẩm khỏi giỏ');
        }

        if ($expectsJson) {
            return response()->json(['success' => true, 'cartCount' => 0], 200);
        }

        return redirect()->route('cart.index')->with('success', 'Đã xóa tất cả sản phẩm khỏi giỏ');
    }
}
