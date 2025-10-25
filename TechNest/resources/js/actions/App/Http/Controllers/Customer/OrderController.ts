import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
export const checkout = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

checkout.definition = {
    methods: ["get","head"],
    url: '/checkout',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkout.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkout.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Customer\OrderController::checkout
* @see app/Http/Controllers/Customer/OrderController.php:22
* @route '/checkout'
*/
checkoutForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: checkout.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

checkout.form = checkoutForm

/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
* @see app/Http/Controllers/Customer/OrderController.php:151
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
* @see app/Http/Controllers/Customer/OrderController.php:151
* @route '/checkout'
*/
placeOrder.url = (options?: RouteQueryOptions) => {
    return placeOrder.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
* @see app/Http/Controllers/Customer/OrderController.php:151
* @route '/checkout'
*/
placeOrder.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: placeOrder.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
* @see app/Http/Controllers/Customer/OrderController.php:151
* @route '/checkout'
*/
const placeOrderForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: placeOrder.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Customer\OrderController::placeOrder
* @see app/Http/Controllers/Customer/OrderController.php:151
* @route '/checkout'
*/
placeOrderForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: placeOrder.url(options),
    method: 'post',
})

placeOrder.form = placeOrderForm

const OrderController = { checkout, placeOrder }

export default OrderController