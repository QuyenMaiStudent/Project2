import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminProductController::index
 * @see app/Http/Controllers/Admin/AdminProductController.php:15
 * @route '/admin/products'
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
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
export const show = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
show.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
show.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
show.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
    const showForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
        showForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\AdminProductController::show
 * @see app/Http/Controllers/Admin/AdminProductController.php:54
 * @route '/admin/products/{product}'
 */
        showForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
 * @see app/Http/Controllers/Admin/AdminProductController.php:93
 * @route '/admin/products/{product}/categories'
 */
export const updateCategories = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCategories.url(args, options),
    method: 'post',
})

updateCategories.definition = {
    methods: ["post"],
    url: '/admin/products/{product}/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
 * @see app/Http/Controllers/Admin/AdminProductController.php:93
 * @route '/admin/products/{product}/categories'
 */
updateCategories.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateCategories.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
 * @see app/Http/Controllers/Admin/AdminProductController.php:93
 * @route '/admin/products/{product}/categories'
 */
updateCategories.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCategories.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
 * @see app/Http/Controllers/Admin/AdminProductController.php:93
 * @route '/admin/products/{product}/categories'
 */
    const updateCategoriesForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateCategories.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
 * @see app/Http/Controllers/Admin/AdminProductController.php:93
 * @route '/admin/products/{product}/categories'
 */
        updateCategoriesForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateCategories.url(args, options),
            method: 'post',
        })
    
    updateCategories.form = updateCategoriesForm
/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateStatus
 * @see app/Http/Controllers/Admin/AdminProductController.php:74
 * @route '/admin/products/{product}/status'
 */
export const updateStatus = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

updateStatus.definition = {
    methods: ["post"],
    url: '/admin/products/{product}/status',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateStatus
 * @see app/Http/Controllers/Admin/AdminProductController.php:74
 * @route '/admin/products/{product}/status'
 */
updateStatus.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateStatus.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateStatus
 * @see app/Http/Controllers/Admin/AdminProductController.php:74
 * @route '/admin/products/{product}/status'
 */
updateStatus.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateStatus.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::updateStatus
 * @see app/Http/Controllers/Admin/AdminProductController.php:74
 * @route '/admin/products/{product}/status'
 */
    const updateStatusForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateStatus.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::updateStatus
 * @see app/Http/Controllers/Admin/AdminProductController.php:74
 * @route '/admin/products/{product}/status'
 */
        updateStatusForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateStatus.url(args, options),
            method: 'post',
        })
    
    updateStatus.form = updateStatusForm
/**
* @see \App\Http\Controllers\Admin\AdminProductController::toggleActive
 * @see app/Http/Controllers/Admin/AdminProductController.php:105
 * @route '/admin/products/{product}/toggle-active'
 */
export const toggleActive = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

toggleActive.definition = {
    methods: ["patch"],
    url: '/admin/products/{product}/toggle-active',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::toggleActive
 * @see app/Http/Controllers/Admin/AdminProductController.php:105
 * @route '/admin/products/{product}/toggle-active'
 */
toggleActive.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleActive.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::toggleActive
 * @see app/Http/Controllers/Admin/AdminProductController.php:105
 * @route '/admin/products/{product}/toggle-active'
 */
toggleActive.patch = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActive.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Admin\AdminProductController::toggleActive
 * @see app/Http/Controllers/Admin/AdminProductController.php:105
 * @route '/admin/products/{product}/toggle-active'
 */
    const toggleActiveForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActive.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Admin\AdminProductController::toggleActive
 * @see app/Http/Controllers/Admin/AdminProductController.php:105
 * @route '/admin/products/{product}/toggle-active'
 */
        toggleActiveForm.patch = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActive.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActive.form = toggleActiveForm
const products = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
updateCategories: Object.assign(updateCategories, updateCategories),
updateStatus: Object.assign(updateStatus, updateStatus),
toggleActive: Object.assign(toggleActive, toggleActive),
}

export default products