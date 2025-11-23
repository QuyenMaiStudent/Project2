import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/seller/promotions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:19
 * @route '/seller/promotions'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/seller/promotions/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:44
 * @route '/seller/promotions/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:58
 * @route '/seller/promotions'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/seller/promotions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:58
 * @route '/seller/promotions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:58
 * @route '/seller/promotions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:58
 * @route '/seller/promotions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:58
 * @route '/seller/promotions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:123
 * @route '/seller/promotions/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/seller/promotions/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:123
 * @route '/seller/promotions/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:123
 * @route '/seller/promotions/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:123
 * @route '/seller/promotions/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:123
 * @route '/seller/promotions/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:137
 * @route '/seller/promotions/{id}/toggle-status'
 */
export const toggleStatus = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

toggleStatus.definition = {
    methods: ["post"],
    url: '/seller/promotions/{id}/toggle-status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:137
 * @route '/seller/promotions/{id}/toggle-status'
 */
toggleStatus.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return toggleStatus.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:137
 * @route '/seller/promotions/{id}/toggle-status'
 */
toggleStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:137
 * @route '/seller/promotions/{id}/toggle-status'
 */
    const toggleStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:137
 * @route '/seller/promotions/{id}/toggle-status'
 */
        toggleStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
export const usageStats = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usageStats.url(args, options),
    method: 'get',
})

usageStats.definition = {
    methods: ["get","head"],
    url: '/seller/promotions/{id}/usage',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
usageStats.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return usageStats.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
usageStats.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usageStats.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
usageStats.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: usageStats.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
    const usageStatsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: usageStats.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
        usageStatsForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usageStats.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:149
 * @route '/seller/promotions/{id}/usage'
 */
        usageStatsForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usageStats.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    usageStats.form = usageStatsForm
const SellerPromotionController = { index, create, store, destroy, toggleStatus, usageStats }

export default SellerPromotionController