import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
 * @route '/seller/promotions'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
 * @route '/seller/promotions'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
 * @route '/seller/promotions'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
 * @route '/seller/promotions'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
 * @route '/seller/promotions'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::index
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:17
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
 * @route '/seller/promotions/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
 * @route '/seller/promotions/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
 * @route '/seller/promotions/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
 * @route '/seller/promotions/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
 * @route '/seller/promotions/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::create
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:34
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:40
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:40
 * @route '/seller/promotions'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:40
 * @route '/seller/promotions'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:40
 * @route '/seller/promotions'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::store
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:40
 * @route '/seller/promotions'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
export const edit = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/seller/promotions/{id}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
edit.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
edit.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
edit.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
    const editForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
        editForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::edit
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:87
 * @route '/seller/promotions/{id}/edit'
 */
        editForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::update
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:98
 * @route '/seller/promotions/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/seller/promotions/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::update
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:98
 * @route '/seller/promotions/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::update
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:98
 * @route '/seller/promotions/{id}'
 */
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::update
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:98
 * @route '/seller/promotions/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::update
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:98
 * @route '/seller/promotions/{id}'
 */
        updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:144
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:144
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:144
 * @route '/seller/promotions/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::destroy
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:144
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:144
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:158
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:158
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:158
 * @route '/seller/promotions/{id}/toggle-status'
 */
toggleStatus.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:158
 * @route '/seller/promotions/{id}/toggle-status'
 */
    const toggleStatusForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::toggleStatus
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:158
 * @route '/seller/promotions/{id}/toggle-status'
 */
        toggleStatusForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleStatus.url(args, options),
            method: 'post',
        })
    
    toggleStatus.form = toggleStatusForm
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
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
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
 * @route '/seller/promotions/{id}/usage'
 */
usageStats.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usageStats.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
 * @route '/seller/promotions/{id}/usage'
 */
usageStats.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: usageStats.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
 * @route '/seller/promotions/{id}/usage'
 */
    const usageStatsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: usageStats.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
 * @route '/seller/promotions/{id}/usage'
 */
        usageStatsForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usageStats.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\SellerPromotionController::usageStats
 * @see app/Http/Controllers/Seller/SellerPromotionController.php:170
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
const SellerPromotionController = { index, create, store, edit, update, destroy, toggleStatus, usageStats }

export default SellerPromotionController