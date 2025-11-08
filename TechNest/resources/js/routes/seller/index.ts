import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import products from './products'
import promotions from './promotions'
import live from './live'
/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/seller/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\SellerController::dashboard
* @see app/Http/Controllers/Seller/SellerController.php:13
* @route '/seller/dashboard'
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

const seller = {
    dashboard: Object.assign(dashboard, dashboard),
    products: Object.assign(products, products),
    promotions: Object.assign(promotions, promotions),
    live: Object.assign(live, live),
}

export default seller