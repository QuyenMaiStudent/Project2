<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\User;
use App\Models\Brand;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Category;
use App\Models\District;
use App\Models\Notification;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusLog;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\ProductImage;
use App\Models\ProductSpec;
use App\Models\ProductTag;
use App\Models\ProductVariant;
use App\Models\ProductVersion;
use App\Models\Promotion;
use App\Models\PromotionCondition;
use App\Models\Province;
use App\Models\Refund;
use App\Models\Review;
use App\Models\ReviewFeedback;
use App\Models\ReviewModerationLog;
use App\Models\Role;
use App\Models\ShippingAddress;
use App\Models\ShippingMethod;
use App\Models\ShippingTracking;
use App\Models\SupportTicket;
use App\Models\SupportTicketReply;
use App\Models\Transaction;
use App\Models\UserActivityLog;
use App\Models\UserAddress;
use App\Models\UserProfile;
use App\Models\UserSetting;
use App\Models\Ward;
use App\Models\WarrantyPolicy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Wishlist;
use App\Models\WishlistItem;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // Xóa dữ liệu bảng trung gian trước
        DB::table('product_category')->truncate();
        DB::table('product_tag_product')->truncate();
        DB::table('promotion_usages')->truncate();
        DB::table('user_role')->truncate();

        // Xóa dữ liệu các bảng chính
        Banner::truncate();
        Brand::truncate();
        Cart::truncate();
        CartItem::truncate();
        Category::truncate();
        District::truncate();
        Notification::truncate();
        Order::truncate();
        OrderItem::truncate();
        OrderStatusLog::truncate();
        Payment::truncate();
        PaymentMethod::truncate();
        Product::truncate();
        ProductImage::truncate();
        ProductSpec::truncate();
        ProductTag::truncate();
        ProductVariant::truncate();
        ProductVersion::truncate();
        Promotion::truncate();
        PromotionCondition::truncate();
        Province::truncate();
        Refund::truncate();
        Review::truncate();
        ReviewFeedback::truncate();
        ReviewModerationLog::truncate();
        Role::truncate();
        ShippingAddress::truncate();
        ShippingMethod::truncate();
        ShippingTracking::truncate();
        SupportTicket::truncate();
        SupportTicketReply::truncate();
        Transaction::truncate();
        UserActivityLog::truncate();
        UserAddress::truncate();
        UserProfile::truncate();
        UserSetting::truncate();
        Ward::truncate();
        WarrantyPolicy::truncate();
        Wishlist::truncate();
        WishlistItem::truncate();
        User::truncate();

        Schema::enableForeignKeyConstraints();

        // Tạo 3 role mẫu: admin, seller, customer
        $adminRole = Role::factory()->create(['name' => 'admin', 'description' => 'Quản trị viên']);
        $sellerRole = Role::factory()->create(['name' => 'seller', 'description' => 'Người bán']);
        $customerRole = Role::factory()->create(['name' => 'customer', 'description' => 'Khách hàng']);

        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role_id' => $adminRole->id,
            'is_active' => true,
        ]);

        User::factory(5)->create([
            'role_id' => $sellerRole->id,
            'is_active' => true,
        ]);

        User::factory(10)->create([
            'role_id' => $customerRole->id,
            'is_active' => true,
        ]);

        // Sửa seed cho bảng user_role theo yêu cầu
        foreach (User::all() as $user) {
            if ($user->id == 1) {
                DB::table('user_role')->insert([
                    'user_id' => $user->id,
                    'role_id' => $adminRole->id,
                ]);
            } elseif ($user->id >= 2 && $user->id <= 6) {
                DB::table('user_role')->insert([
                    'user_id' => $user->id,
                    'role_id' => $sellerRole->id,
                ]);
            } else {
                DB::table('user_role')->insert([
                    'user_id' => $user->id,
                    'role_id' => $customerRole->id,
                ]);
            }
        }

        $parent = Category::factory(5)->create();

        Category::factory(10)->create([
            'parent_id' => $parent->random()->id,
        ]);

        Brand::factory(10)->create();

        WarrantyPolicy::factory(5)->create();

        PaymentMethod::factory(5)->create();

        ShippingMethod::factory(4)->create();

        
        if (Province::count() === 0) {
            Province::factory(10)->create();
        }

        if (District::count() === 0) {
            District::factory(20)->create();
        }

        Ward::factory(30)->create();

        foreach (User::all() as $user) {
            UserProfile::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        UserAddress::factory(20)->create();

        UserActivityLog::factory(50)->create();

        foreach (User::all() as $user) {
            UserSetting::factory()->create([
                'user_id' => $user->id,
            ]);
        }

        Product::factory(30)->create()->each(function ($product) {
            $variantCount = rand(2, 4);
            $variantStocks = [];
            $totalStock = 0;

            // Sinh stock ngẫu nhiên cho từng variant và tính tổng
            for ($i = 0; $i < $variantCount; $i++) {
                $stock = rand(1, 20);
                $variantStocks[] = $stock;
                $totalStock += $stock;
            }

            foreach ($variantStocks as $stock) {
                ProductVariant::factory()->create([
                    'product_id' => $product->id,
                    'price' => $product->price,
                    'stock' => $stock,
                ]);
            }

            // Cập nhật lại stock của product là tổng stock các variant
            $product->stock = $totalStock;
            $product->save();
        });

        ProductImage::factory(90)->create();

        ProductSpec::factory(100)->create();

        ProductTag::factory(10)->create();

        foreach (Product::all() as $product) {
            $tagIds = ProductTag::inRandomOrder()->limit(rand(1, 5))->pluck('id');
            foreach ($tagIds as $tagId) {
                DB::table('product_tag_product')->insert([
                    'product_id' => $product->id,
                    'product_tag_id' => $tagId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        foreach (Product::all() as $product) {
            $categoryIds = Category::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            foreach ($categoryIds as $categoryId) {
                DB::table('product_category')->insert([
                    'product_id' => $product->id,
                    'category_id' => $categoryId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        ProductVersion::factory(50)->create();

        Review::factory(100)->create();

        ReviewModerationLog::factory(30)->create();

        ReviewFeedback::factory(50)->create();

        foreach (User::all() as $user) {
            // Tạo cart cho user
            $cart = Cart::factory()->create(['user_id' => $user->id]);

            // Chọn ngẫu nhiên các sản phẩm còn hàng
            $products = Product::where('stock', '>', 0)->inRandomOrder()->limit(rand(2, 5))->get();
            $cartItems = [];
            foreach ($products as $product) {
                $variant = $product->variants()->where('stock', '>', 0)->inRandomOrder()->first();
                if (!$variant) continue;

                $maxQty = $variant->stock;
                if ($maxQty < 1) continue;
                $quantity = rand(1, $maxQty);

                // Sửa lại ở đây: lưu cart item vào mảng
                $cartItem = CartItem::factory()->create([
                    'cart_id' => $cart->id,
                    'product_id' => $product->id,
                    'product_variant_id' => $variant->id,
                    'quantity' => $quantity,
                ]);
                $cartItems[] = $cartItem;
            }

            // Tạo order từ cart, user_id giống cart
            if (count($cartItems) === 0) continue; // Thêm dòng này trước khi tạo order

            $order = Order::factory()->create(['user_id' => $cart->user_id]);
            $total = 0;
            foreach ($cartItems as $item) {
                $variant = $item->variant;
                $maxQty = $variant ? $variant->stock : 0;
                $quantity = min($item->quantity, $maxQty);

                $price = $variant ? $variant->price : 0;
                $total += $price * $quantity;

                OrderItem::factory()->create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'quantity' => $quantity,
                    'price' => $price,
                ]);

                // Giảm stock của variant trước
                if ($variant) {
                    $variant->stock = max(0, $variant->stock - $quantity);
                    $variant->save();
                }
            }
            $order->total_amount = $total;
            $order->save();

            // Sau khi tạo order cho user
            if (count($cartItems) === 0) continue;
        }

        // Sau khi tạo xong tất cả order và giảm stock variant
        foreach (Product::all() as $product) {
            $product->stock = $product->variants()->sum('stock');
            $product->save();
        }

        // Mỗi user một wishlist
        foreach (User::all() as $user) {
            Wishlist::factory()->create(['user_id' => $user->id]);
        }

        // Tạo wishlist item cho từng wishlist
        foreach (Wishlist::all() as $wishlist) {
            $productIds = Product::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            foreach ($productIds as $productId) {
                WishlistItem::factory()->create([
                    'wishlist_id' => $wishlist->id,
                    'product_id' => $productId,
                ]);
            }
        }

        OrderStatusLog::factory(70)->create();

        foreach (Order::all() as $order) {
            ShippingTracking::factory()->create(['order_id' => $order->id]);
        }

        ShippingAddress::factory(40)->create();

        foreach (Order::all() as $order) {
            Payment::factory()->create(['order_id' => $order->id]);
        }

        Refund::factory(30)->create();

        Transaction::factory(80)->create();

        Promotion::factory(5)->create();

        foreach (User::all() as $user) {
            $promotionIds = Promotion::inRandomOrder()->limit(rand(1, 3))->pluck('id');
            foreach ($promotionIds as $promotionId) {
                DB::table('promotion_usages')->insert([
                    'promotion_id' => $promotionId,
                    'user_id' => $user->id,
                    'used_times' => rand(0, 3),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        PromotionCondition::factory(40)->create();

        Banner::factory(10)->create();

        Notification::factory(50)->create();

        SupportTicket::factory(30)->create();

        SupportTicketReply::factory(30)->create();
    }
}
