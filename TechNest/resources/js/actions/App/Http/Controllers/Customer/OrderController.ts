import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
 * @see app/Http/Controllers/Customer/OrderController.php:24
 * @route '/checkout'
 */
export const placeOrder = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeOrder.url(options),
    method: 'post',
})

placeOrder.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
 * @see app/Http/Controllers/Customer/OrderController.php:24
 * @route '/checkout'
 */
placeOrder.url = (options?: RouteQueryOptions) => {
    return placeOrder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
 * @see app/Http/Controllers/Customer/OrderController.php:24
 * @route '/checkout'
 */
placeOrder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeOrder.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
 * @see app/Http/Controllers/Customer/OrderController.php:24
 * @route '/checkout'
 */
    const placeOrderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: placeOrder.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
 * @see app/Http/Controllers/Customer/OrderController.php:24
 * @route '/checkout'
 */
        placeOrderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: placeOrder.url(options),
            method: 'post',
        })
    
    placeOrder.form = placeOrderForm
/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/orders',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::index
 * @see app/Http/Controllers/Customer/OrderController.php:200
 * @route '/orders'
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
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
const show5d07ec4e36119df081df6c80b02e8808 = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show5d07ec4e36119df081df6c80b02e8808.url(args, options),
    method: 'get',
})

show5d07ec4e36119df081df6c80b02e8808.definition = {
    methods: ["get","head"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
show5d07ec4e36119df081df6c80b02e8808.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return show5d07ec4e36119df081df6c80b02e8808.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
show5d07ec4e36119df081df6c80b02e8808.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show5d07ec4e36119df081df6c80b02e8808.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
show5d07ec4e36119df081df6c80b02e8808.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show5d07ec4e36119df081df6c80b02e8808.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
    const show5d07ec4e36119df081df6c80b02e8808Form = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show5d07ec4e36119df081df6c80b02e8808.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
        show5d07ec4e36119df081df6c80b02e8808Form.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show5d07ec4e36119df081df6c80b02e8808.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
        show5d07ec4e36119df081df6c80b02e8808Form.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show5d07ec4e36119df081df6c80b02e8808.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show5d07ec4e36119df081df6c80b02e8808.form = show5d07ec4e36119df081df6c80b02e8808Form
    /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
const show05c988c2fb107aab7054465b25591e48 = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show05c988c2fb107aab7054465b25591e48.url(args, options),
    method: 'get',
})

show05c988c2fb107aab7054465b25591e48.definition = {
    methods: ["get","head"],
    url: '/customer/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
show05c988c2fb107aab7054465b25591e48.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { order: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: typeof args.order === 'object'
                ? args.order.id
                : args.order,
                }

    return show05c988c2fb107aab7054465b25591e48.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
show05c988c2fb107aab7054465b25591e48.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show05c988c2fb107aab7054465b25591e48.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
show05c988c2fb107aab7054465b25591e48.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show05c988c2fb107aab7054465b25591e48.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
    const show05c988c2fb107aab7054465b25591e48Form = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show05c988c2fb107aab7054465b25591e48.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
        show05c988c2fb107aab7054465b25591e48Form.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show05c988c2fb107aab7054465b25591e48.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
        show05c988c2fb107aab7054465b25591e48Form.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show05c988c2fb107aab7054465b25591e48.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show05c988c2fb107aab7054465b25591e48.form = show05c988c2fb107aab7054465b25591e48Form

export const show = {
    '/orders/{order}': show5d07ec4e36119df081df6c80b02e8808,
    '/customer/orders/{order}': show05c988c2fb107aab7054465b25591e48,
}

const OrderController = { placeOrder, index, show }

export default OrderController