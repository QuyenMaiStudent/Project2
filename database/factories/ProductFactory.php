<?php

namespace Database\Factories;

use App\Models\Brand;
use App\Models\WarrantyPolicy;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $names = [
            // Laptop
            'MacBook Pro 16', 'MacBook Air M2', 'Dell XPS 13', 'Dell Inspiron 15', 'HP Spectre x360',
            'HP Pavilion 14', 'Lenovo ThinkPad X1', 'Lenovo Yoga Slim 7', 'Asus ZenBook 14', 'Asus ROG Strix',
            'Acer Swift 3', 'Acer Nitro 5', 'MSI Modern 15', 'MSI GF63', 'Surface Laptop 5',
            // Điện thoại
            'iPhone 15 Pro Max', 'iPhone 14', 'Samsung Galaxy S24 Ultra', 'Samsung Galaxy A54', 'Xiaomi Mi 13',
            'Oppo Reno10', 'Vivo V27', 'Realme 11 Pro', 'Google Pixel 8', 'Sony Xperia 1 V',
            // Phụ kiện
            'Apple AirPods Pro', 'Samsung Galaxy Buds2', 'Logitech MX Master 3S', 'Anker PowerCore 10000',
            'JBL Flip 6', 'WD My Passport SSD'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($names),
            'description' => $this->faker->sentence(),
            'price' => $this->faker->numberBetween(100000, 20000000),
            'stock' => $this->faker->numberBetween(10, 100),
            'brand_id' => Brand::inRandomOrder()->first()?->id ?? Brand::factory(),
            'warranty_id' => WarrantyPolicy::inRandomOrder()->first()?->id ?? WarrantyPolicy::factory(),
            'is_active' => $this->faker->boolean(90),
            'created_by' => 2, // Giả sử user với ID 1 luôn tồn tại
        ];
    }
}
