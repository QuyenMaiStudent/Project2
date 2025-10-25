import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/seller/products/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::create
* @see app/Http/Controllers/Seller/ProductController.php:30
* @route '/seller/products/create'
*/
createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: create.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

create.form = createForm

/**
* @see \App\Http\Controllers\Seller\ProductController::store
* @see app/Http/Controllers/Seller/ProductController.php:41
* @route '/seller/products'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/seller/products',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::store
* @see app/Http/Controllers/Seller/ProductController.php:41
* @route '/seller/products'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::store
* @see app/Http/Controllers/Seller/ProductController.php:41
* @route '/seller/products'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::store
* @see app/Http/Controllers/Seller/ProductController.php:41
* @route '/seller/products'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::store
* @see app/Http/Controllers/Seller/ProductController.php:41
* @route '/seller/products'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/seller/products',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::index
* @see app/Http/Controllers/Seller/ProductController.php:17
* @route '/seller/products'
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
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
export const preview = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/seller/products/{product}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
preview.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return preview.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
preview.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
preview.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
const previewForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
previewForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::preview
* @see app/Http/Controllers/Seller/ProductController.php:180
* @route '/seller/products/{product}/preview'
*/
previewForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: preview.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

preview.form = previewForm

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
* @see app/Http/Controllers/Seller/ProductController.php:196
* @route '/seller/products/{product}/submit'
*/
export const submitForApproval = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitForApproval.url(args, options),
    method: 'post',
})

submitForApproval.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
* @see app/Http/Controllers/Seller/ProductController.php:196
* @route '/seller/products/{product}/submit'
*/
submitForApproval.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { product: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: typeof args.product === 'object'
        ? args.product.id
        : args.product,
    }

    return submitForApproval.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
* @see app/Http/Controllers/Seller/ProductController.php:196
* @route '/seller/products/{product}/submit'
*/
submitForApproval.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submitForApproval.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
* @see app/Http/Controllers/Seller/ProductController.php:196
* @route '/seller/products/{product}/submit'
*/
const submitForApprovalForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitForApproval.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Seller\ProductController::submitForApproval
* @see app/Http/Controllers/Seller/ProductController.php:196
* @route '/seller/products/{product}/submit'
*/
submitForApprovalForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: submitForApproval.url(args, options),
    method: 'post',
})

submitForApproval.form = submitForApprovalForm

const ProductController = { create, store, index, preview, submitForApproval }

export default ProductController