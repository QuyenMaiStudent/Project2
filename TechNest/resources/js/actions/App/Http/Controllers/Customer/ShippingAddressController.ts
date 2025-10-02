import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/shipping-addresses',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::index
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:19
 * @route '/shipping-addresses'
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
* @see \App\Http\Controllers\Customer\ShippingAddressController::store
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:41
 * @route '/shipping-addresses'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/shipping-addresses',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::store
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:41
 * @route '/shipping-addresses'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::store
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:41
 * @route '/shipping-addresses'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::store
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:41
 * @route '/shipping-addresses'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::store
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:41
 * @route '/shipping-addresses'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::update
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:87
 * @route '/shipping-addresses/{shippingAddress}'
 */
export const update = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/shipping-addresses/{shippingAddress}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::update
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:87
 * @route '/shipping-addresses/{shippingAddress}'
 */
update.url = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shippingAddress: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { shippingAddress: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    shippingAddress: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        shippingAddress: typeof args.shippingAddress === 'object'
                ? args.shippingAddress.id
                : args.shippingAddress,
                }

    return update.definition.url
            .replace('{shippingAddress}', parsedArgs.shippingAddress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::update
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:87
 * @route '/shipping-addresses/{shippingAddress}'
 */
update.put = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::update
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:87
 * @route '/shipping-addresses/{shippingAddress}'
 */
    const updateForm = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::update
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:87
 * @route '/shipping-addresses/{shippingAddress}'
 */
        updateForm.put = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Customer\ShippingAddressController::destroy
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:121
 * @route '/shipping-addresses/{shippingAddress}'
 */
export const destroy = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/shipping-addresses/{shippingAddress}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::destroy
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:121
 * @route '/shipping-addresses/{shippingAddress}'
 */
destroy.url = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { shippingAddress: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { shippingAddress: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    shippingAddress: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        shippingAddress: typeof args.shippingAddress === 'object'
                ? args.shippingAddress.id
                : args.shippingAddress,
                }

    return destroy.definition.url
            .replace('{shippingAddress}', parsedArgs.shippingAddress.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\ShippingAddressController::destroy
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:121
 * @route '/shipping-addresses/{shippingAddress}'
 */
destroy.delete = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::destroy
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:121
 * @route '/shipping-addresses/{shippingAddress}'
 */
    const destroyForm = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\ShippingAddressController::destroy
 * @see app/Http/Controllers/Customer/ShippingAddressController.php:121
 * @route '/shipping-addresses/{shippingAddress}'
 */
        destroyForm.delete = (args: { shippingAddress: number | { id: number } } | [shippingAddress: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const ShippingAddressController = { index, store, update, destroy }

export default ShippingAddressController