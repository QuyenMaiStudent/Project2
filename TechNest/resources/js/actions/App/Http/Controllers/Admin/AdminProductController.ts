import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
export const pending = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})

pending.definition = {
    methods: ["get","head"],
    url: '/admin/products/pending',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
pending.url = (options?: RouteQueryOptions) => {
    return pending.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
pending.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pending.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
pending.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pending.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
const pendingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pending.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
pendingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pending.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::pending
* @see app/Http/Controllers/Admin/AdminProductController.php:13
* @route '/admin/products/pending'
*/
pendingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pending.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pending.form = pendingForm

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
export const approved = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approved.url(options),
    method: 'get',
})

approved.definition = {
    methods: ["get","head"],
    url: '/admin/products/approved',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
approved.url = (options?: RouteQueryOptions) => {
    return approved.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
approved.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: approved.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
approved.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: approved.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
const approvedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approved.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
approvedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approved.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approved
* @see app/Http/Controllers/Admin/AdminProductController.php:65
* @route '/admin/products/approved'
*/
approvedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: approved.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

approved.form = approvedForm

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
export const rejected = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rejected.url(options),
    method: 'get',
})

rejected.definition = {
    methods: ["get","head"],
    url: '/admin/products/rejected',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
rejected.url = (options?: RouteQueryOptions) => {
    return rejected.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
rejected.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: rejected.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
rejected.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: rejected.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
const rejectedForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rejected.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
rejectedForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rejected.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::rejected
* @see app/Http/Controllers/Admin/AdminProductController.php:77
* @route '/admin/products/rejected'
*/
rejectedForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: rejected.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

rejected.form = rejectedForm

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
export const show = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/products/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
show.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
show.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
show.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
const showForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
showForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::show
* @see app/Http/Controllers/Admin/AdminProductController.php:25
* @route '/admin/products/{product}'
*/
showForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
* @see app/Http/Controllers/Admin/AdminProductController.php:89
* @route '/admin/products/{product}/categories'
*/
export const updateCategories = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCategories.url(args, options),
    method: 'post',
})

updateCategories.definition = {
    methods: ["post"],
    url: '/admin/products/{product}/categories',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
* @see app/Http/Controllers/Admin/AdminProductController.php:89
* @route '/admin/products/{product}/categories'
*/
updateCategories.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return updateCategories.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
* @see app/Http/Controllers/Admin/AdminProductController.php:89
* @route '/admin/products/{product}/categories'
*/
updateCategories.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: updateCategories.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
* @see app/Http/Controllers/Admin/AdminProductController.php:89
* @route '/admin/products/{product}/categories'
*/
const updateCategoriesForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCategories.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::updateCategories
* @see app/Http/Controllers/Admin/AdminProductController.php:89
* @route '/admin/products/{product}/categories'
*/
updateCategoriesForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateCategories.url(args, options),
    method: 'post',
})

updateCategories.form = updateCategoriesForm

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approve
* @see app/Http/Controllers/Admin/AdminProductController.php:45
* @route '/admin/products/{product}/approve'
*/
export const approve = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

approve.definition = {
    methods: ["post"],
    url: '/admin/products/{product}/approve',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approve
* @see app/Http/Controllers/Admin/AdminProductController.php:45
* @route '/admin/products/{product}/approve'
*/
approve.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approve
* @see app/Http/Controllers/Admin/AdminProductController.php:45
* @route '/admin/products/{product}/approve'
*/
approve.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approve
* @see app/Http/Controllers/Admin/AdminProductController.php:45
* @route '/admin/products/{product}/approve'
*/
const approveForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::approve
* @see app/Http/Controllers/Admin/AdminProductController.php:45
* @route '/admin/products/{product}/approve'
*/
approveForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: approve.url(args, options),
    method: 'post',
})

approve.form = approveForm

/**
* @see \App\Http\Controllers\Admin\AdminProductController::reject
* @see app/Http/Controllers/Admin/AdminProductController.php:55
* @route '/admin/products/{product}/reject'
*/
export const reject = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

reject.definition = {
    methods: ["post"],
    url: '/admin/products/{product}/reject',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\AdminProductController::reject
* @see app/Http/Controllers/Admin/AdminProductController.php:55
* @route '/admin/products/{product}/reject'
*/
reject.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return reject.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdminProductController::reject
* @see app/Http/Controllers/Admin/AdminProductController.php:55
* @route '/admin/products/{product}/reject'
*/
reject.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::reject
* @see app/Http/Controllers/Admin/AdminProductController.php:55
* @route '/admin/products/{product}/reject'
*/
const rejectForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\AdminProductController::reject
* @see app/Http/Controllers/Admin/AdminProductController.php:55
* @route '/admin/products/{product}/reject'
*/
rejectForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: reject.url(args, options),
    method: 'post',
})

reject.form = rejectForm

const AdminProductController = { pending, approved, rejected, show, updateCategories, approve, reject }

export default AdminProductController