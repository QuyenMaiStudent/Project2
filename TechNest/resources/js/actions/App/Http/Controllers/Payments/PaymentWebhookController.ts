import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::stripe
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:17
 * @route '/webhooks/stripe'
 */
export const stripe = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stripe.url(options),
    method: 'post',
})

stripe.definition = {
    methods: ["post"],
    url: '/webhooks/stripe',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::stripe
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:17
 * @route '/webhooks/stripe'
 */
stripe.url = (options?: RouteQueryOptions) => {
    return stripe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::stripe
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:17
 * @route '/webhooks/stripe'
 */
stripe.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: stripe.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::stripe
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:17
 * @route '/webhooks/stripe'
 */
    const stripeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: stripe.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::stripe
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:17
 * @route '/webhooks/stripe'
 */
        stripeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: stripe.url(options),
            method: 'post',
        })
    
    stripe.form = stripeForm
/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
 * @route '/webhooks/momo'
 */
export const momo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: momo.url(options),
    method: 'post',
})

momo.definition = {
    methods: ["post"],
    url: '/webhooks/momo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
 * @route '/webhooks/momo'
 */
momo.url = (options?: RouteQueryOptions) => {
    return momo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
 * @route '/webhooks/momo'
 */
momo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: momo.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
 * @route '/webhooks/momo'
 */
    const momoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: momo.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
 * @route '/webhooks/momo'
 */
        momoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: momo.url(options),
            method: 'post',
        })
    
    momo.form = momoForm
/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
 * @route '/webhooks/vnpay'
 */
export const vnpay = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vnpay.url(options),
    method: 'post',
})

vnpay.definition = {
    methods: ["post"],
    url: '/webhooks/vnpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
 * @route '/webhooks/vnpay'
 */
vnpay.url = (options?: RouteQueryOptions) => {
    return vnpay.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
 * @route '/webhooks/vnpay'
 */
vnpay.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vnpay.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
 * @route '/webhooks/vnpay'
 */
    const vnpayForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: vnpay.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
 * @route '/webhooks/vnpay'
 */
        vnpayForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: vnpay.url(options),
            method: 'post',
        })
    
    vnpay.form = vnpayForm
/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::paypalWebhook
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:164
 * @route '/webhooks/paypal'
 */
export const paypalWebhook = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paypalWebhook.url(options),
    method: 'post',
})

paypalWebhook.definition = {
    methods: ["post"],
    url: '/webhooks/paypal',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::paypalWebhook
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:164
 * @route '/webhooks/paypal'
 */
paypalWebhook.url = (options?: RouteQueryOptions) => {
    return paypalWebhook.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::paypalWebhook
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:164
 * @route '/webhooks/paypal'
 */
paypalWebhook.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: paypalWebhook.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::paypalWebhook
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:164
 * @route '/webhooks/paypal'
 */
    const paypalWebhookForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: paypalWebhook.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::paypalWebhook
 * @see app/Http/Controllers/Payments/PaymentWebhookController.php:164
 * @route '/webhooks/paypal'
 */
        paypalWebhookForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: paypalWebhook.url(options),
            method: 'post',
        })
    
    paypalWebhook.form = paypalWebhookForm
const PaymentWebhookController = { stripe, momo, vnpay, paypalWebhook }

export default PaymentWebhookController