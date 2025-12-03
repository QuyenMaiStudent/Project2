<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductDetailController extends Controller
{
    public function __invoke($id)
    {
        // load variant image relation so frontend có url ảnh cho mỗi variant
        $product = Product::with([
            'brand',
            'images' => fn($q) => $q,
            'variants.image', // eager load image relation on variants
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
                    'price' => $product->price + ($v->additional_price ?? 0),
                    'stock' => $v->stock,
                    'image_url' => optional($v->image)->url ?? null, // thêm trường image_url
                ]),
                'specs' => $product->specs->map(fn($s) => [
                    'key' => $s->key,
                    'value' => $s->value,
                ]),
            ],
        ]);
    }
}
