<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Brand>
 */
class BrandFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $brands = [
            'Apple', 'Samsung', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Sony', 'Xiaomi',
            'Oppo', 'Vivo', 'Realme', 'Huawei', 'Logitech', 'Razer', 'Corsair', 'Kingston', 'Anker', 'JBL'
        ];

        return [
            'name' => $this->faker->unique()->randomElement($brands),
            'logo' => $this->faker->imageUrl(200, 200, 'business', true, 'Brand'),
            'description' => $this->faker->sentence(),
        ];
    }
}
