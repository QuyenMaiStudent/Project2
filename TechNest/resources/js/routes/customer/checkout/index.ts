import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
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
const checkout = {
    placeOrder: Object.assign(placeOrder, placeOrder),
}

export default checkout