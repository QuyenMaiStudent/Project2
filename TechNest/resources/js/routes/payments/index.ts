import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
export const returnMethod = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(args, options),
    method: 'get',
})

returnMethod.definition = {
    methods: ["get","head"],
    url: '/payments/{provider}/return',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
returnMethod.url = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return returnMethod.definition.url
            .replace('{provider}', parsedArgs.provider.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
returnMethod.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: returnMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
returnMethod.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: returnMethod.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
const returnMethodForm = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: returnMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
returnMethodForm.get = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: returnMethod.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Payments\PaymentReturnController::returnMethod
* @see app/Http/Controllers/Payments/PaymentReturnController.php:13
* @route '/payments/{provider}/return'
*/
returnMethodForm.head = (args: { provider: string | number } | [provider: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: returnMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

returnMethod.form = returnMethodForm

const payments = {
    return: Object.assign(returnMethod, returnMethod),
}

export default payments