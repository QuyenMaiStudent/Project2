<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductDetailController extends Controller
{
    public function __invoke($id)
    {
        $product = Product::with([
            'brand',
            'images' => fn($q) => $q,
            'variants',
            'specs',
        ])->findOrFail($id);

        return Inertia::render("ProductDetail", [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'stock' => $product->stock,
                'brand' => $product->brand ? $product->brand->name : null,
                'images' => $product->images->map(fn($img) => [
                    'url' => $img->url,
                    'alt_text' => $img->alt_text,
                    'is_primary' => $img->is_primary,
                ]),
                'variants' => $product->variants->map(fn($v) => [
                    'id' => $v->id,
                    'variant_name' => $v->variant_name,
                    'price' => $product->price + ($v->additional_price ?? 0), // tính giá cuối cùng
                    'stock' => $v->stock,
                ]),
                'specs' => $product->specs->map(fn($s) => [
                    'key' => $s->key,
                    'value' => $s->value,
                ]),
            ],
        ]);
    }
}
