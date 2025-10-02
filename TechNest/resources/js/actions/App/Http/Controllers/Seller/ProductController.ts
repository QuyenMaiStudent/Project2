import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
const index431eb3176f0b3b6628922509e73230e6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index431eb3176f0b3b6628922509e73230e6.url(options),
    method: 'get',
})

index431eb3176f0b3b6628922509e73230e6.definition = {
    methods: ["get","head"],
    url: '/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
index431eb3176f0b3b6628922509e73230e6.url = (options?: RouteQueryOptions) => {
    return index431eb3176f0b3b6628922509e73230e6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
index431eb3176f0b3b6628922509e73230e6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index431eb3176f0b3b6628922509e73230e6.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
index431eb3176f0b3b6628922509e73230e6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index431eb3176f0b3b6628922509e73230e6.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
    const index431eb3176f0b3b6628922509e73230e6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index431eb3176f0b3b6628922509e73230e6.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
        index431eb3176f0b3b6628922509e73230e6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index431eb3176f0b3b6628922509e73230e6.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/products'
 */
        index431eb3176f0b3b6628922509e73230e6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index431eb3176f0b3b6628922509e73230e6.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index431eb3176f0b3b6628922509e73230e6.form = index431eb3176f0b3b6628922509e73230e6Form
    /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
const index51278487ae4b9875ef03ed320537cc58 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index51278487ae4b9875ef03ed320537cc58.url(options),
    method: 'get',
})

index51278487ae4b9875ef03ed320537cc58.definition = {
    methods: ["get","head"],
    url: '/seller/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
index51278487ae4b9875ef03ed320537cc58.url = (options?: RouteQueryOptions) => {
    return index51278487ae4b9875ef03ed320537cc58.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
index51278487ae4b9875ef03ed320537cc58.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index51278487ae4b9875ef03ed320537cc58.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
index51278487ae4b9875ef03ed320537cc58.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index51278487ae4b9875ef03ed320537cc58.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
    const index51278487ae4b9875ef03ed320537cc58Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index51278487ae4b9875ef03ed320537cc58.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
        index51278487ae4b9875ef03ed320537cc58Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index51278487ae4b9875ef03ed320537cc58.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:17
 * @route '/seller/products'
 */
        index51278487ae4b9875ef03ed320537cc58Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index51278487ae4b9875ef03ed320537cc58.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index51278487ae4b9875ef03ed320537cc58.form = index51278487ae4b9875ef03ed320537cc58Form

export const index = {
    '/products': index431eb3176f0b3b6628922509e73230e6,
    '/seller/products': index51278487ae4b9875ef03ed320537cc58,
}

/**
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
 */
export const show = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
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
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
 */
show.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
 */
show.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
 */
    const showForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
 */
        showForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::show
 * @see app/Http/Controllers/Seller/ProductController.php:93
 * @route '/products/{product}'
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
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/seller/products/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:30
 * @route '/seller/products/create'
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
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:41
 * @route '/seller/products'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/seller/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:41
 * @route '/seller/products'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:41
 * @route '/seller/products'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:41
 * @route '/seller/products'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:41
 * @route '/seller/products'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
export const preview = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/seller/products/{product}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
preview.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return preview.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
preview.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
preview.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
    const previewForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
        previewForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
        previewForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
export const submitForApproval = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitForApproval.url(args, options),
    method: 'post',
})

submitForApproval.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
submitForApproval.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return submitForApproval.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
submitForApproval.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitForApproval.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
    const submitForApprovalForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submitForApproval.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
        submitForApprovalForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submitForApproval.url(args, options),
            method: 'post',
        })
    
    submitForApproval.form = submitForApprovalForm
const ProductController = { index, show, create, store, preview, submitForApproval }

export default ProductController