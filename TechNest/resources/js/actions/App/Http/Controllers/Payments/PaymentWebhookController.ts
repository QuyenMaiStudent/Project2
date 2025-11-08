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
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/webhooks/vnpay'
*/
const vnpayab6696fe4b4c7b88e5c06c6161cfec9f = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vnpayab6696fe4b4c7b88e5c06c6161cfec9f.url(options),
    method: 'post',
})

vnpayab6696fe4b4c7b88e5c06c6161cfec9f.definition = {
    methods: ["post"],
    url: '/webhooks/vnpay',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/webhooks/vnpay'
*/
vnpayab6696fe4b4c7b88e5c06c6161cfec9f.url = (options?: RouteQueryOptions) => {
    return vnpayab6696fe4b4c7b88e5c06c6161cfec9f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/webhooks/vnpay'
*/
vnpayab6696fe4b4c7b88e5c06c6161cfec9f.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vnpayab6696fe4b4c7b88e5c06c6161cfec9f.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/webhooks/vnpay'
*/
const vnpayab6696fe4b4c7b88e5c06c6161cfec9fForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vnpayab6696fe4b4c7b88e5c06c6161cfec9f.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/webhooks/vnpay'
*/
vnpayab6696fe4b4c7b88e5c06c6161cfec9fForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vnpayab6696fe4b4c7b88e5c06c6161cfec9f.url(options),
    method: 'post',
})

vnpayab6696fe4b4c7b88e5c06c6161cfec9f.form = vnpayab6696fe4b4c7b88e5c06c6161cfec9fForm
/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/payments/vnpay/ipn'
*/
const vnpaye77a4efb72462bc9be86c18a6845d39a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vnpaye77a4efb72462bc9be86c18a6845d39a.url(options),
    method: 'post',
})

vnpaye77a4efb72462bc9be86c18a6845d39a.definition = {
    methods: ["post"],
    url: '/payments/vnpay/ipn',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/payments/vnpay/ipn'
*/
vnpaye77a4efb72462bc9be86c18a6845d39a.url = (options?: RouteQueryOptions) => {
    return vnpaye77a4efb72462bc9be86c18a6845d39a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/payments/vnpay/ipn'
*/
vnpaye77a4efb72462bc9be86c18a6845d39a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vnpaye77a4efb72462bc9be86c18a6845d39a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/payments/vnpay/ipn'
*/
const vnpaye77a4efb72462bc9be86c18a6845d39aForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vnpaye77a4efb72462bc9be86c18a6845d39a.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::vnpay
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:79
* @route '/payments/vnpay/ipn'
*/
vnpaye77a4efb72462bc9be86c18a6845d39aForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vnpaye77a4efb72462bc9be86c18a6845d39a.url(options),
    method: 'post',
})

vnpaye77a4efb72462bc9be86c18a6845d39a.form = vnpaye77a4efb72462bc9be86c18a6845d39aForm

export const vnpay = {
    '/webhooks/vnpay': vnpayab6696fe4b4c7b88e5c06c6161cfec9f,
    '/payments/vnpay/ipn': vnpaye77a4efb72462bc9be86c18a6845d39a,
}

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

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
* @route '/webhooks/momo/ipn'
*/
export const momo = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: momo.url(options),
    method: 'post',
})

momo.definition = {
    methods: ["post"],
    url: '/webhooks/momo/ipn',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
* @route '/webhooks/momo/ipn'
*/
momo.url = (options?: RouteQueryOptions) => {
    return momo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
* @route '/webhooks/momo/ipn'
*/
momo.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: momo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
* @route '/webhooks/momo/ipn'
*/
const momoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: momo.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Payments\PaymentWebhookController::momo
* @see app/Http/Controllers/Payments/PaymentWebhookController.php:74
* @route '/webhooks/momo/ipn'
*/
momoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: momo.url(options),
    method: 'post',
})

momo.form = momoForm

const PaymentWebhookController = { stripe, vnpay, paypalWebhook, momo }

export default PaymentWebhookController