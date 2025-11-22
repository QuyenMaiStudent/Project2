import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
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
export const show = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
show.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
show.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
show.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
    const showForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
        showForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::show
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/orders/{order}'
 */
        showForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
export const detail = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(args, options),
    method: 'get',
})

detail.definition = {
    methods: ["get","head"],
    url: '/customer/orders/{order}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
detail.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return detail.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
detail.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detail.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
detail.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detail.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
    const detailForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detail.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
        detailForm.get = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detail.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::detail
 * @see app/Http/Controllers/Customer/OrderController.php:226
 * @route '/customer/orders/{order}'
 */
        detailForm.head = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detail.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detail.form = detailForm
/**
* @see \App\Http\Controllers\Customer\OrderController::retryPayment
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/retry-payment'
 */
export const retryPayment = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryPayment.url(args, options),
    method: 'post',
})

retryPayment.definition = {
    methods: ["post"],
    url: '/customer/orders/{order}/retry-payment',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::retryPayment
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/retry-payment'
 */
retryPayment.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: args.order,
                }

    return retryPayment.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::retryPayment
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/retry-payment'
 */
retryPayment.post = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: retryPayment.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::retryPayment
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/retry-payment'
 */
    const retryPaymentForm = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: retryPayment.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::retryPayment
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/retry-payment'
 */
        retryPaymentForm.post = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: retryPayment.url(args, options),
            method: 'post',
        })
    
    retryPayment.form = retryPaymentForm
/**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/cancel'
 */
export const cancel = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

cancel.definition = {
    methods: ["post"],
    url: '/customer/orders/{order}/cancel',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/cancel'
 */
cancel.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: args.order,
                }

    return cancel.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/cancel'
 */
cancel.post = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancel.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/cancel'
 */
    const cancelForm = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancel.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::cancel
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/cancel'
 */
        cancelForm.post = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancel.url(args, options),
            method: 'post',
        })
    
    cancel.form = cancelForm
/**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
export const refundRequest = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refundRequest.url(args, options),
    method: 'get',
})

refundRequest.definition = {
    methods: ["get","head"],
    url: '/customer/orders/{order}/refund-request',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
refundRequest.url = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { order: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    order: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        order: args.order,
                }

    return refundRequest.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
refundRequest.get = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refundRequest.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
refundRequest.head = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: refundRequest.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
    const refundRequestForm = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: refundRequest.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
        refundRequestForm.get = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: refundRequest.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\OrderController::refundRequest
 * @see app/Http/Controllers/Customer/OrderController.php:0
 * @route '/customer/orders/{order}/refund-request'
 */
        refundRequestForm.head = (args: { order: string | number } | [order: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: refundRequest.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    refundRequest.form = refundRequestForm
/**
* @see \App\Http\Controllers\Customer\CustomerOrderDeliveryController::confirmReceived
 * @see app/Http/Controllers/Customer/CustomerOrderDeliveryController.php:13
 * @route '/customer/orders/{order}/confirm-received'
 */
export const confirmReceived = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmReceived.url(args, options),
    method: 'post',
})

confirmReceived.definition = {
    methods: ["post"],
    url: '/customer/orders/{order}/confirm-received',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\CustomerOrderDeliveryController::confirmReceived
 * @see app/Http/Controllers/Customer/CustomerOrderDeliveryController.php:13
 * @route '/customer/orders/{order}/confirm-received'
 */
confirmReceived.url = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return confirmReceived.definition.url
            .replace('{order}', parsedArgs.order.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerOrderDeliveryController::confirmReceived
 * @see app/Http/Controllers/Customer/CustomerOrderDeliveryController.php:13
 * @route '/customer/orders/{order}/confirm-received'
 */
confirmReceived.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmReceived.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerOrderDeliveryController::confirmReceived
 * @see app/Http/Controllers/Customer/CustomerOrderDeliveryController.php:13
 * @route '/customer/orders/{order}/confirm-received'
 */
    const confirmReceivedForm = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmReceived.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerOrderDeliveryController::confirmReceived
 * @see app/Http/Controllers/Customer/CustomerOrderDeliveryController.php:13
 * @route '/customer/orders/{order}/confirm-received'
 */
        confirmReceivedForm.post = (args: { order: number | { id: number } } | [order: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmReceived.url(args, options),
            method: 'post',
        })
    
    confirmReceived.form = confirmReceivedForm
const orders = {
    index: Object.assign(index, index),
show: Object.assign(show, show),
detail: Object.assign(detail, detail),
retryPayment: Object.assign(retryPayment, retryPayment),
cancel: Object.assign(cancel, cancel),
refundRequest: Object.assign(refundRequest, refundRequest),
confirmReceived: Object.assign(confirmReceived, confirmReceived),
}

export default orders