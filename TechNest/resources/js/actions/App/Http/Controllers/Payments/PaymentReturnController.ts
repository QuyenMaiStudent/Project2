import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
export const handle = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handle.url(args, options),
    method: 'get',
})

handle.definition = {
    methods: ["get","head"],
    url: '/payments/{provider}/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
handle.url = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provider: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    provider: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        provider: args.provider,
                }

    return handle.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
handle.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: handle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
handle.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: handle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
    const handleForm = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: handle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
        handleForm.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: handle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Payments\PaymentReturnController::handle
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:13
 * @route '/payments/{provider}/return'
 */
        handleForm.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: handle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    handle.form = handleForm
/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::momoReturn
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:0
 * @route '/webhooks/momo'
 */
export const momoReturn = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: momoReturn.url(options),
    method: 'post',
})

momoReturn.definition = {
    methods: ["post"],
    url: '/webhooks/momo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::momoReturn
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:0
 * @route '/webhooks/momo'
 */
momoReturn.url = (options?: RouteQueryOptions) => {
    return momoReturn.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::momoReturn
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:0
 * @route '/webhooks/momo'
 */
momoReturn.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: momoReturn.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Payments\PaymentReturnController::momoReturn
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:0
 * @route '/webhooks/momo'
 */
    const momoReturnForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: momoReturn.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Payments\PaymentReturnController::momoReturn
 * @see app/Http/Controllers/Payments/PaymentReturnController.php:0
 * @route '/webhooks/momo'
 */
        momoReturnForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: momoReturn.url(options),
            method: 'post',
        })
    
    momoReturn.form = momoReturnForm
const PaymentReturnController = { handle, momoReturn }

export default PaymentReturnController