<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Tạo 1 admin
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
        ]);

        // Tạo 3 seller
        $sellers = User::factory(3)->create([
            'role' => 'seller',
        ]);

        // Tạo 10 customer
        $customers = User::factory(10)->create([
            'role' => 'customer',
        ]);

        // Tạo brands và categories
        $brands = Brand::factory(5)->create();
        $categories = Category::factory(5)->create();

        // Tạo products, gán seller, brand, category ngẫu nhiên
        $products = Product::factory(20)->make()->each(function ($product) use ($sellers, $brands, $categories) {
            $product->seller_id = $sellers->random()->id;
            $product->brand_id = $brands->random()->id;
            $product->category_id = $categories->random()->id;
            $product->save();
        });

        // Tạo orders cho customer ngẫu nhiên
        $orders = Order::factory(10)->make()->each(function ($order) use ($customers) {
            $order->user_id = $customers->random()->id;
            $order->save();
        });

        // Tạo order items cho mỗi order
        foreach ($orders as $order) {
            OrderItem::factory(3)->make()->each(function ($item) use ($order, $products) {
                $item->order_id = $order->id;
                $item->product_id = $products->random()->id;
                $item->save();
            });
        }
    }
}
