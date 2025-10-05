<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::inRandomOrder()->first() ?? Product::factory()->create();

        // Chỉ tạo một số variant thực tế mà web bán, ví dụ chỉ bán màu xanh 128GB hoặc màu đen 256GB
        // Thêm nhiều dữ liệu mẫu cho variants
        $variants = [
            ['variant_name' => 'Xanh 128GB'],
            ['variant_name' => 'Đen 256GB'],
            ['variant_name' => 'Bạc 512GB'],
            ['variant_name' => 'Xám 1TB'],
            ['variant_name' => 'Đỏ 128GB'],
            ['variant_name' => 'Vàng 256GB'],
            ['variant_name' => 'Trắng 64GB'],
            ['variant_name' => 'Tím 128GB'],
            ['variant_name' => 'Cam 256GB'],
            ['variant_name' => 'Hồng 512GB'],
            ['variant_name' => 'Xanh lá 128GB'],
            ['variant_name' => 'Đen bóng 1TB'],
            ['variant_name' => 'Bạc ánh kim 256GB'],
            ['variant_name' => 'Vàng đồng 512GB'],
            ['variant_name' => 'Xanh dương 128GB'],
            ['variant_name' => 'Đỏ đô 256GB'],
            ['variant_name' => 'Xám bạc 512GB'],
            ['variant_name' => 'Trắng ngọc 1TB'],
            ['variant_name' => 'Xanh navy 128GB'],
            ['variant_name' => 'Vàng chanh 256GB'],
        ];

        $variant = $this->faker->randomElement($variants);

        return [
            'product_id' => Product::factory(),
            'variant_name' => $variant['variant_name'],
            'additional_price' => $this->faker->numberBetween(0, 500000),
            'stock' => $this->faker->numberBetween(1, 20),
        ];
    }
}
