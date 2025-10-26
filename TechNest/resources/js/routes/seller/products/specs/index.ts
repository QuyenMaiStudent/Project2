import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
 */
export const index = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/seller/products/{product}/specs',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
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
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
 */
index.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
 */
index.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
 */
    const indexForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
 */
        indexForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductSpecController::index
 * @see app/Http/Controllers/Seller/ProductSpecController.php:15
 * @route '/seller/products/{product}/specs'
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
* @see \App\Http\Controllers\Seller\ProductSpecController::store
 * @see app/Http/Controllers/Seller/ProductSpecController.php:28
 * @route '/seller/products/{product}/specs'
 */
export const store = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/specs',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductSpecController::store
 * @see app/Http/Controllers/Seller/ProductSpecController.php:28
 * @route '/seller/products/{product}/specs'
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
* @see \App\Http\Controllers\Seller\ProductSpecController::store
 * @see app/Http/Controllers/Seller/ProductSpecController.php:28
 * @route '/seller/products/{product}/specs'
 */
store.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductSpecController::store
 * @see app/Http/Controllers/Seller/ProductSpecController.php:28
 * @route '/seller/products/{product}/specs'
 */
    const storeForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductSpecController::store
 * @see app/Http/Controllers/Seller/ProductSpecController.php:28
 * @route '/seller/products/{product}/specs'
 */
        storeForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(args, options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Seller\ProductSpecController::update
 * @see app/Http/Controllers/Seller/ProductSpecController.php:50
 * @route '/seller/products/{product}/specs/{spec}'
 */
export const update = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/seller/products/{product}/specs/{spec}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Seller\ProductSpecController::update
 * @see app/Http/Controllers/Seller/ProductSpecController.php:50
 * @route '/seller/products/{product}/specs/{spec}'
 */
update.url = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                    spec: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                                spec: typeof args.spec === 'object'
                ? args.spec.id
                : args.spec,
                }

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{spec}', parsedArgs.spec.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductSpecController::update
 * @see app/Http/Controllers/Seller/ProductSpecController.php:50
 * @route '/seller/products/{product}/specs/{spec}'
 */
update.put = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Seller\ProductSpecController::update
 * @see app/Http/Controllers/Seller/ProductSpecController.php:50
 * @route '/seller/products/{product}/specs/{spec}'
 */
    const updateForm = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductSpecController::update
 * @see app/Http/Controllers/Seller/ProductSpecController.php:50
 * @route '/seller/products/{product}/specs/{spec}'
 */
        updateForm.put = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Seller\ProductSpecController::destroy
 * @see app/Http/Controllers/Seller/ProductSpecController.php:86
 * @route '/seller/products/{product}/specs/{spec}'
 */
export const destroy = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/seller/products/{product}/specs/{spec}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Seller\ProductSpecController::destroy
 * @see app/Http/Controllers/Seller/ProductSpecController.php:86
 * @route '/seller/products/{product}/specs/{spec}'
 */
destroy.url = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                    spec: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: typeof args.product === 'object'
                ? args.product.id
                : args.product,
                                spec: typeof args.spec === 'object'
                ? args.spec.id
                : args.spec,
                }

    return destroy.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{spec}', parsedArgs.spec.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductSpecController::destroy
 * @see app/Http/Controllers/Seller/ProductSpecController.php:86
 * @route '/seller/products/{product}/specs/{spec}'
 */
destroy.delete = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\ProductSpecController::destroy
 * @see app/Http/Controllers/Seller/ProductSpecController.php:86
 * @route '/seller/products/{product}/specs/{spec}'
 */
    const destroyForm = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductSpecController::destroy
 * @see app/Http/Controllers/Seller/ProductSpecController.php:86
 * @route '/seller/products/{product}/specs/{spec}'
 */
        destroyForm.delete = (args: { product: number | { id: number }, spec: number | { id: number } } | [product: number | { id: number }, spec: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const specs = {
    index: Object.assign(index, index),
store: Object.assign(store, store),
update: Object.assign(update, update),
destroy: Object.assign(destroy, destroy),
}

export default specs