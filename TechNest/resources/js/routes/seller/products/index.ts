import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import specs from './specs'
import variants from './variants'
/**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
export const checkCart = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCart.url(args, options),
    method: 'get',
})

checkCart.definition = {
    methods: ["get","head"],
    url: '/seller/products/{product}/check-cart',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
checkCart.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return checkCart.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
checkCart.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCart.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
checkCart.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkCart.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
    const checkCartForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkCart.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
        checkCartForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkCart.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::checkCart
 * @see app/Http/Controllers/Seller/ProductController.php:222
 * @route '/seller/products/{product}/check-cart'
 */
        checkCartForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkCart.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkCart.form = checkCartForm
/**
* @see \App\Http\Controllers\Seller\ProductController::clearCartItems
 * @see app/Http/Controllers/Seller/ProductController.php:234
 * @route '/seller/products/{product}/clear-cart-items'
 */
export const clearCartItems = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCartItems.url(args, options),
    method: 'post',
})

clearCartItems.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/clear-cart-items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::clearCartItems
 * @see app/Http/Controllers/Seller/ProductController.php:234
 * @route '/seller/products/{product}/clear-cart-items'
 */
clearCartItems.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return clearCartItems.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::clearCartItems
 * @see app/Http/Controllers/Seller/ProductController.php:234
 * @route '/seller/products/{product}/clear-cart-items'
 */
clearCartItems.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clearCartItems.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::clearCartItems
 * @see app/Http/Controllers/Seller/ProductController.php:234
 * @route '/seller/products/{product}/clear-cart-items'
 */
    const clearCartItemsForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clearCartItems.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::clearCartItems
 * @see app/Http/Controllers/Seller/ProductController.php:234
 * @route '/seller/products/{product}/clear-cart-items'
 */
        clearCartItemsForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clearCartItems.url(args, options),
            method: 'post',
        })
    
    clearCartItems.form = clearCartItemsForm
/**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:35
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
 * @see app/Http/Controllers/Seller/ProductController.php:35
 * @route '/seller/products/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:35
 * @route '/seller/products/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:35
 * @route '/seller/products/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:35
 * @route '/seller/products/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:35
 * @route '/seller/products/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::create
 * @see app/Http/Controllers/Seller/ProductController.php:35
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
 * @see app/Http/Controllers/Seller/ProductController.php:64
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
 * @see app/Http/Controllers/Seller/ProductController.php:64
 * @route '/seller/products'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:64
 * @route '/seller/products'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:64
 * @route '/seller/products'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::store
 * @see app/Http/Controllers/Seller/ProductController.php:64
 * @route '/seller/products'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:21
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
 * @see app/Http/Controllers/Seller/ProductController.php:21
 * @route '/seller/products'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:21
 * @route '/seller/products'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:21
 * @route '/seller/products'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:21
 * @route '/seller/products'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:21
 * @route '/seller/products'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::index
 * @see app/Http/Controllers/Seller/ProductController.php:21
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
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
export const edit = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/seller/products/{product}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
edit.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
edit.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
edit.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
    const editForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
        editForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::edit
 * @see app/Http/Controllers/Seller/ProductController.php:264
 * @route '/seller/products/{product}/edit'
 */
        editForm.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\Seller\ProductController::update
 * @see app/Http/Controllers/Seller/ProductController.php:305
 * @route '/seller/products/{product}'
 */
export const update = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/seller/products/{product}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::update
 * @see app/Http/Controllers/Seller/ProductController.php:305
 * @route '/seller/products/{product}'
 */
update.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::update
 * @see app/Http/Controllers/Seller/ProductController.php:305
 * @route '/seller/products/{product}'
 */
update.put = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::update
 * @see app/Http/Controllers/Seller/ProductController.php:305
 * @route '/seller/products/{product}'
 */
    const updateForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::update
 * @see app/Http/Controllers/Seller/ProductController.php:305
 * @route '/seller/products/{product}'
 */
        updateForm.put = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
export const showUploadImages = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showUploadImages.url(options),
    method: 'get',
})

showUploadImages.definition = {
    methods: ["get","head"],
    url: '/seller/products/upload-images',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
showUploadImages.url = (options?: RouteQueryOptions) => {
    return showUploadImages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
showUploadImages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showUploadImages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
showUploadImages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showUploadImages.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
    const showUploadImagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showUploadImages.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
        showUploadImagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showUploadImages.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:15
 * @route '/seller/products/upload-images'
 */
        showUploadImagesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showUploadImages.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showUploadImages.form = showUploadImagesForm
/**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:27
 * @route '/seller/products/{product}/upload-images'
 */
export const uploadImages = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImages.url(args, options),
    method: 'post',
})

uploadImages.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/upload-images',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:27
 * @route '/seller/products/{product}/upload-images'
 */
uploadImages.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return uploadImages.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:27
 * @route '/seller/products/{product}/upload-images'
 */
uploadImages.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImages.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:27
 * @route '/seller/products/{product}/upload-images'
 */
    const uploadImagesForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadImages.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:27
 * @route '/seller/products/{product}/upload-images'
 */
        uploadImagesForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadImages.url(args, options),
            method: 'post',
        })
    
    uploadImages.form = uploadImagesForm
/**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:72
 * @route '/seller/products/{product}/images/{image}'
 */
export const deleteImage = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteImage.url(args, options),
    method: 'delete',
})

deleteImage.definition = {
    methods: ["delete"],
    url: '/seller/products/{product}/images/{image}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:72
 * @route '/seller/products/{product}/images/{image}'
 */
deleteImage.url = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    product: args[0],
                    image: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        product: args.product,
                                image: typeof args.image === 'object'
                ? args.image.id
                : args.image,
                }

    return deleteImage.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace('{image}', parsedArgs.image.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:72
 * @route '/seller/products/{product}/images/{image}'
 */
deleteImage.delete = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteImage.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:72
 * @route '/seller/products/{product}/images/{image}'
 */
    const deleteImageForm = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteImage.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:72
 * @route '/seller/products/{product}/images/{image}'
 */
        deleteImageForm.delete = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteImage.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteImage.form = deleteImageForm
/**
* @see \App\Http\Controllers\Seller\ProductController::toggleVisibility
 * @see app/Http/Controllers/Seller/ProductController.php:658
 * @route '/seller/products/{product}/toggle-visibility'
 */
export const toggleVisibility = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVisibility.url(args, options),
    method: 'post',
})

toggleVisibility.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/toggle-visibility',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::toggleVisibility
 * @see app/Http/Controllers/Seller/ProductController.php:658
 * @route '/seller/products/{product}/toggle-visibility'
 */
toggleVisibility.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return toggleVisibility.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::toggleVisibility
 * @see app/Http/Controllers/Seller/ProductController.php:658
 * @route '/seller/products/{product}/toggle-visibility'
 */
toggleVisibility.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: toggleVisibility.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::toggleVisibility
 * @see app/Http/Controllers/Seller/ProductController.php:658
 * @route '/seller/products/{product}/toggle-visibility'
 */
    const toggleVisibilityForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleVisibility.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::toggleVisibility
 * @see app/Http/Controllers/Seller/ProductController.php:658
 * @route '/seller/products/{product}/toggle-visibility'
 */
        toggleVisibilityForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleVisibility.url(args, options),
            method: 'post',
        })
    
    toggleVisibility.form = toggleVisibilityForm
/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:570
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
 * @see app/Http/Controllers/Seller/ProductController.php:570
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
 * @see app/Http/Controllers/Seller/ProductController.php:570
 * @route '/seller/products/{product}/preview'
 */
preview.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:570
 * @route '/seller/products/{product}/preview'
 */
preview.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:570
 * @route '/seller/products/{product}/preview'
 */
    const previewForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:570
 * @route '/seller/products/{product}/preview'
 */
        previewForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:570
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
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:586
 * @route '/seller/products/{product}/submit'
 */
export const submit = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

submit.definition = {
    methods: ["post"],
    url: '/seller/products/{product}/submit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:586
 * @route '/seller/products/{product}/submit'
 */
submit.url = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return submit.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:586
 * @route '/seller/products/{product}/submit'
 */
submit.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:586
 * @route '/seller/products/{product}/submit'
 */
    const submitForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:586
 * @route '/seller/products/{product}/submit'
 */
        submitForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, options),
            method: 'post',
        })
    
    submit.form = submitForm
const products = {
    checkCart: Object.assign(checkCart, checkCart),
clearCartItems: Object.assign(clearCartItems, clearCartItems),
create: Object.assign(create, create),
store: Object.assign(store, store),
index: Object.assign(index, index),
edit: Object.assign(edit, edit),
update: Object.assign(update, update),
showUploadImages: Object.assign(showUploadImages, showUploadImages),
uploadImages: Object.assign(uploadImages, uploadImages),
deleteImage: Object.assign(deleteImage, deleteImage),
specs: Object.assign(specs, specs),
variants: Object.assign(variants, variants),
toggleVisibility: Object.assign(toggleVisibility, toggleVisibility),
preview: Object.assign(preview, preview),
submit: Object.assign(submit, submit),
}

export default products