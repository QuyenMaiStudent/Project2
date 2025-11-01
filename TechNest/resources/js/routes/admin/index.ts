import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import products from './products'
import categories from './categories'
import users from './users'
import promotions from './promotions'
import brands from './brands'
import locations from './locations'
/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminController::dashboard
* @see app/Http/Controllers/Admin/AdminController.php:16
* @route '/admin/dashboard'
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
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
export const locationtest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: locationtest.url(options),
    method: 'get',
})

locationtest.definition = {
    methods: ["get","head"],
    url: '/admin/locationtest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
locationtest.url = (options?: RouteQueryOptions) => {
    return locationtest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
locationtest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: locationtest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
locationtest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: locationtest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
const locationtestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: locationtest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
locationtestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: locationtest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::locationtest
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
locationtestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: locationtest.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

locationtest.form = locationtestForm

const admin = {
    dashboard: Object.assign(dashboard, dashboard),
    products: Object.assign(products, products),
    categories: Object.assign(categories, categories),
    users: Object.assign(users, users),
    promotions: Object.assign(promotions, promotions),
    brands: Object.assign(brands, brands),
    locations: Object.assign(locations, locations),
    locationtest: Object.assign(locationtest, locationtest),
}

export default admin