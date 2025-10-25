import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
export const index = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/products/{productId}/comments',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
index.url = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productId: args }
    }

    if (Array.isArray(args)) {
        args = {
            productId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        productId: args.productId,
    }

    return index.definition.url
            .replace('{productId}', parsedArgs.productId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
index.get = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
index.head = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
const indexForm = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
indexForm.get = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::index
* @see app/Http/Controllers/CommentController.php:11
* @route '/products/{productId}/comments'
*/
indexForm.head = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:50
* @route '/products/{productId}/comments'
*/
export const store = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/products/{productId}/comments',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:50
* @route '/products/{productId}/comments'
*/
store.url = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productId: args }
    }

    if (Array.isArray(args)) {
        args = {
            productId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        productId: args.productId,
    }

    return store.definition.url
            .replace('{productId}', parsedArgs.productId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:50
* @route '/products/{productId}/comments'
*/
store.post = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:50
* @route '/products/{productId}/comments'
*/
const storeForm = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::store
* @see app/Http/Controllers/CommentController.php:50
* @route '/products/{productId}/comments'
*/
storeForm.post = (args: { productId: string | number } | [productId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/products/comments/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CommentController::show
* @see app/Http/Controllers/CommentController.php:78
* @route '/products/comments/{id}'
*/
showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:104
* @route '/products/comments/{id}'
*/
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/products/comments/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:104
* @route '/products/comments/{id}'
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
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:104
* @route '/products/comments/{id}'
*/
update.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:104
* @route '/products/comments/{id}'
*/
const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::update
* @see app/Http/Controllers/CommentController.php:104
* @route '/products/comments/{id}'
*/
updateForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:121
* @route '/products/comments/{id}'
*/
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/products/comments/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:121
* @route '/products/comments/{id}'
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
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:121
* @route '/products/comments/{id}'
*/
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:121
* @route '/products/comments/{id}'
*/
const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::destroy
* @see app/Http/Controllers/CommentController.php:121
* @route '/products/comments/{id}'
*/
destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

/**
* @see \App\Http\Controllers\CommentController::report
* @see app/Http/Controllers/CommentController.php:133
* @route '/products/comments/{id}/report'
*/
export const report = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

report.definition = {
    methods: ["post"],
    url: '/products/comments/{id}/report',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::report
* @see app/Http/Controllers/CommentController.php:133
* @route '/products/comments/{id}/report'
*/
report.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return report.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::report
* @see app/Http/Controllers/CommentController.php:133
* @route '/products/comments/{id}/report'
*/
report.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::report
* @see app/Http/Controllers/CommentController.php:133
* @route '/products/comments/{id}/report'
*/
const reportForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: report.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::report
* @see app/Http/Controllers/CommentController.php:133
* @route '/products/comments/{id}/report'
*/
reportForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: report.url(args, options),
    method: 'post',
})

report.form = reportForm

/**
* @see \App\Http\Controllers\CommentController::like
* @see app/Http/Controllers/CommentController.php:151
* @route '/products/comments/{id}/like'
*/
export const like = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

like.definition = {
    methods: ["post"],
    url: '/products/comments/{id}/like',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::like
* @see app/Http/Controllers/CommentController.php:151
* @route '/products/comments/{id}/like'
*/
like.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return like.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::like
* @see app/Http/Controllers/CommentController.php:151
* @route '/products/comments/{id}/like'
*/
like.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::like
* @see app/Http/Controllers/CommentController.php:151
* @route '/products/comments/{id}/like'
*/
const likeForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: like.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::like
* @see app/Http/Controllers/CommentController.php:151
* @route '/products/comments/{id}/like'
*/
likeForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: like.url(args, options),
    method: 'post',
})

like.form = likeForm

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:176
* @route '/products/comments/{id}/pin'
*/
export const pin = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pin.url(args, options),
    method: 'post',
})

pin.definition = {
    methods: ["post"],
    url: '/products/comments/{id}/pin',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:176
* @route '/products/comments/{id}/pin'
*/
pin.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return pin.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:176
* @route '/products/comments/{id}/pin'
*/
pin.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pin.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:176
* @route '/products/comments/{id}/pin'
*/
const pinForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pin.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::pin
* @see app/Http/Controllers/CommentController.php:176
* @route '/products/comments/{id}/pin'
*/
pinForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pin.url(args, options),
    method: 'post',
})

pin.form = pinForm

/**
* @see \App\Http\Controllers\CommentController::hide
* @see app/Http/Controllers/CommentController.php:188
* @route '/products/comments/{id}/hide'
*/
export const hide = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hide.url(args, options),
    method: 'post',
})

hide.definition = {
    methods: ["post"],
    url: '/products/comments/{id}/hide',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CommentController::hide
* @see app/Http/Controllers/CommentController.php:188
* @route '/products/comments/{id}/hide'
*/
hide.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return hide.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CommentController::hide
* @see app/Http/Controllers/CommentController.php:188
* @route '/products/comments/{id}/hide'
*/
hide.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: hide.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::hide
* @see app/Http/Controllers/CommentController.php:188
* @route '/products/comments/{id}/hide'
*/
const hideForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hide.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CommentController::hide
* @see app/Http/Controllers/CommentController.php:188
* @route '/products/comments/{id}/hide'
*/
hideForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: hide.url(args, options),
    method: 'post',
})

hide.form = hideForm

const CommentController = { index, store, show, update, destroy, report, like, pin, hide }

export default CommentController