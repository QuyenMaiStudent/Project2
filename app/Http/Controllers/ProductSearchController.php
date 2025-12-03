<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductSearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->string('q')->toString();
        $limit = $request->integer('limit', 10);

        if (empty($query)) {
            return response()->json(['products' => []]);
        }

        $products = Product::with(['brand', 'images', 'specs'])
            ->where('is_active', true)
            ->where('status', 'approved')
            ->where(function($q) use ($query) {
                $q->where('name', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%")
                  ->orWhereHas('brand', function($subQ) use ($query) {
                      $subQ->where('name', 'LIKE', "%{$query}%");
                  })
                  // Tìm kiếm trong thông số kỹ thuật
                  ->orWhereHas('specs', function($specQ) use ($query) {
                      $specQ->where('key', 'LIKE', "%{$query}%")
                           ->orWhere('value', 'LIKE', "%{$query}%");
                  });
            })
            ->limit($limit)
            ->get()
            ->map(function ($product) use ($query) {
                // Tìm specs liên quan để hiển thị
                $relevantSpecs = $product->specs->filter(function($spec) use ($query) {
                    return stripos($spec->key, $query) !== false || 
                           stripos($spec->value, $query) !== false;
                })->take(2);

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'brand' => $product->brand?->name,
                    'image' => $product->images->first()?->url ?? '/images/logo.png',
                    'url' => "/products/{$product->id}",
                    'relevant_specs' => $relevantSpecs->map(fn($spec) => [
                        'key' => $spec->key,
                        'value' => $spec->value
                    ])->toArray()
                ];
            });

        return response()->json(['products' => $products]);
    }
}
