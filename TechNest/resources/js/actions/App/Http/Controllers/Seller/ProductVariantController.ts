import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
export const index = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/seller/products/{product}/variants',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
index.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return index.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
index.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
index.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
    const indexForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
        indexForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductVariantController::index
 * @see app/Http/Controllers/Seller/ProductVariantController.php:20
 * @route '/seller/products/{product}/variants'
 */
        indexForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Seller\ProductVariantController::store
 * @see app/Http/Controllers/Seller/ProductVariantController.php:38
 * @route '/seller/products/{product}/variants'
 */
export const store = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/variants',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::store
 * @see app/Http/Controllers/Seller/ProductVariantController.php:38
 * @route '/seller/products/{product}/variants'
 */
store.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { product: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                }

    return store.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::store
 * @see app/Http/Controllers/Seller/ProductVariantController.php:38
 * @route '/seller/products/{product}/variants'
 */
store.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductVariantController::store
 * @see app/Http/Controllers/Seller/ProductVariantController.php:38
 * @route '/seller/products/{product}/variants'
 */
    const storeForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductVariantController::store
 * @see app/Http/Controllers/Seller/ProductVariantController.php:38
 * @route '/seller/products/{product}/variants'
 */
        storeForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
export const update = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","post"],
    url: '/seller/products/{product}/variants/{variant}',
} satisfies RouteDefinition<["put","post"]>

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
update.url = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                    variant: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                                variant: typeof args.variant === 'object'
                ? args.variant.id
                : args.variant,
                }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{variant}', parsedArgs.variant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
update.put = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
update.post = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
    const updateForm = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
        updateForm.put = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductVariantController::update
 * @see app/Http/Controllers/Seller/ProductVariantController.php:125
 * @route '/seller/products/{product}/variants/{variant}'
 */
        updateForm.post = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Seller\ProductVariantController::destroy
 * @see app/Http/Controllers/Seller/ProductVariantController.php:219
 * @route '/seller/products/{product}/variants/{variant}'
 */
export const destroy = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/seller/products/{product}/variants/{variant}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::destroy
 * @see app/Http/Controllers/Seller/ProductVariantController.php:219
 * @route '/seller/products/{product}/variants/{variant}'
 */
destroy.url = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                    variant: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                                variant: typeof args.variant === 'object'
                ? args.variant.id
                : args.variant,
                }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{variant}', parsedArgs.variant.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductVariantController::destroy
 * @see app/Http/Controllers/Seller/ProductVariantController.php:219
 * @route '/seller/products/{product}/variants/{variant}'
 */
destroy.delete = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\ProductVariantController::destroy
 * @see app/Http/Controllers/Seller/ProductVariantController.php:219
 * @route '/seller/products/{product}/variants/{variant}'
 */
    const destroyForm = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductVariantController::destroy
 * @see app/Http/Controllers/Seller/ProductVariantController.php:219
 * @route '/seller/products/{product}/variants/{variant}'
 */
        destroyForm.delete = (args: { product: number | { id: number }, variant: number | { id: number } } | [product: number | { id: number }, variant: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ProductVariantController = { index, store, update, destroy }

export default ProductVariantController