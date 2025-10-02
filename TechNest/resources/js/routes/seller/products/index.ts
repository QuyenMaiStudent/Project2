import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import specs from './specs'
import variants from './variants'
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
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
 * @route '/seller/products/upload-images'
 */
showUploadImages.url = (options?: RouteQueryOptions) => {
    return showUploadImages.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
 * @route '/seller/products/upload-images'
 */
showUploadImages.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showUploadImages.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
 * @route '/seller/products/upload-images'
 */
showUploadImages.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showUploadImages.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
 * @route '/seller/products/upload-images'
 */
    const showUploadImagesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showUploadImages.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
 * @route '/seller/products/upload-images'
 */
        showUploadImagesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showUploadImages.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductImageController::showUploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:14
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:26
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:26
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:26
 * @route '/seller/products/{product}/upload-images'
 */
uploadImages.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadImages.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:26
 * @route '/seller/products/{product}/upload-images'
 */
    const uploadImagesForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadImages.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductImageController::uploadImages
 * @see app/Http/Controllers/Seller/ProductImageController.php:26
 * @route '/seller/products/{product}/upload-images'
 */
        uploadImagesForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadImages.url(args, options),
            method: 'post',
        })
    
    uploadImages.form = uploadImagesForm
/**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:65
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:65
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:65
 * @route '/seller/products/{product}/images/{image}'
 */
deleteImage.delete = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteImage.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:65
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:65
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
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
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
 * @see app/Http/Controllers/Seller/ProductController.php:185
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
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
preview.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
preview.head = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
    const previewForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
 * @route '/seller/products/{product}/preview'
 */
        previewForm.get = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Seller\ProductController::preview
 * @see app/Http/Controllers/Seller/ProductController.php:185
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
 * @see app/Http/Controllers/Seller/ProductController.php:201
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
 * @see app/Http/Controllers/Seller/ProductController.php:201
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
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
submit.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: submit.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
    const submitForm = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: submit.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Seller\ProductController::submit
 * @see app/Http/Controllers/Seller/ProductController.php:201
 * @route '/seller/products/{product}/submit'
 */
        submitForm.post = (args: { product: number | { id: number } } | [product: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: submit.url(args, options),
            method: 'post',
        })
    
    submit.form = submitForm
const products = {
    create: Object.assign(create, create),
store: Object.assign(store, store),
index: Object.assign(index, index),
showUploadImages: Object.assign(showUploadImages, showUploadImages),
uploadImages: Object.assign(uploadImages, uploadImages),
deleteImage: Object.assign(deleteImage, deleteImage),
specs: Object.assign(specs, specs),
variants: Object.assign(variants, variants),
preview: Object.assign(preview, preview),
submit: Object.assign(submit, submit),
}

export default products