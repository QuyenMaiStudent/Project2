import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import checkoutFb28ab from './checkout'
import orders from './orders'
/**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/customer/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
    const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboard.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
        dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\CustomerController::dashboard
 * @see app/Http/Controllers/Customer/CustomerController.php:10
 * @route '/customer/dashboard'
 */
        dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboard.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboard.form = dashboardForm
/**
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
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
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
 * @route '/checkout'
 */
checkout.url = (options?: RouteQueryOptions) => {
    return checkout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
 * @route '/checkout'
 */
checkout.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkout.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
 * @route '/checkout'
 */
checkout.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkout.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
 * @route '/checkout'
 */
    const checkoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkout.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
 * @route '/checkout'
 */
        checkoutForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkout.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\CheckoutController::checkout
 * @see app/Http/Controllers/Customer/CheckoutController.php:17
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
const customer = {
    dashboard: Object.assign(dashboard, dashboard),
checkout: Object.assign(checkout, checkoutFb28ab),
orders: Object.assign(orders, orders),
}

export default customer