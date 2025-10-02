import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Customer\CartController::index
 * @see app/Http/Controllers/Customer/CartController.php:15
 * @route '/cart'
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
* @see \App\Http\Controllers\Customer\CartController::add
 * @see app/Http/Controllers/Customer/CartController.php:40
 * @route '/cart/add'
 */
export const add = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/cart/add',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\CartController::add
 * @see app/Http/Controllers/Customer/CartController.php:40
 * @route '/cart/add'
 */
add.url = (options?: RouteQueryOptions) => {
    return add.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CartController::add
 * @see app/Http/Controllers/Customer/CartController.php:40
 * @route '/cart/add'
 */
add.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\CartController::add
 * @see app/Http/Controllers/Customer/CartController.php:40
 * @route '/cart/add'
 */
    const addForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: add.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\CartController::add
 * @see app/Http/Controllers/Customer/CartController.php:40
 * @route '/cart/add'
 */
        addForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: add.url(options),
            method: 'post',
        })
    
    add.form = addForm
/**
* @see \App\Http\Controllers\Customer\CartController::update
 * @see app/Http/Controllers/Customer/CartController.php:64
 * @route '/cart/update/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/cart/update/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\CartController::update
 * @see app/Http/Controllers/Customer/CartController.php:64
 * @route '/cart/update/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CartController::update
 * @see app/Http/Controllers/Customer/CartController.php:64
 * @route '/cart/update/{id}'
 */
update.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\CartController::update
 * @see app/Http/Controllers/Customer/CartController.php:64
 * @route '/cart/update/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\CartController::update
 * @see app/Http/Controllers/Customer/CartController.php:64
 * @route '/cart/update/{id}'
 */
        updateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\Customer\CartController::destroy
 * @see app/Http/Controllers/Customer/CartController.php:72
 * @route '/cart/delete/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(args, options),
    method: 'post',
})

destroy.definition = {
    methods: ["post"],
    url: '/cart/delete/{id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Customer\CartController::destroy
 * @see app/Http/Controllers/Customer/CartController.php:72
 * @route '/cart/delete/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Customer\CartController::destroy
 * @see app/Http/Controllers/Customer/CartController.php:72
 * @route '/cart/delete/{id}'
 */
destroy.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: destroy.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Customer\CartController::destroy
 * @see app/Http/Controllers/Customer/CartController.php:72
 * @route '/cart/delete/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Customer\CartController::destroy
 * @see app/Http/Controllers/Customer/CartController.php:72
 * @route '/cart/delete/{id}'
 */
        destroyForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, options),
            method: 'post',
        })
    
    destroy.form = destroyForm
const CartController = { index, add, update, destroy }

export default CartController