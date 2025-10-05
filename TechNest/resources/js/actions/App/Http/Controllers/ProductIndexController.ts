import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
const ProductIndexController = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ProductIndexController.url(options),
    method: 'get',
})

ProductIndexController.definition = {
    methods: ["get","head"],
    url: '/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
ProductIndexController.url = (options?: RouteQueryOptions) => {
    return ProductIndexController.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
ProductIndexController.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ProductIndexController.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
ProductIndexController.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ProductIndexController.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
    const ProductIndexControllerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ProductIndexController.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
        ProductIndexControllerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ProductIndexController.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductIndexController::__invoke
 * @see app/Http/Controllers/ProductIndexController.php:11
 * @route '/products'
 */
        ProductIndexControllerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ProductIndexController.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ProductIndexController.form = ProductIndexControllerForm
export default ProductIndexController