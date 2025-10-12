import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:66
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:66
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:66
 * @route '/seller/products/{product}/images/{image}'
 */
deleteImage.delete = (args: { product: string | number, image: number | { id: number } } | [product: string | number, image: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteImage.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Seller\ProductImageController::deleteImage
 * @see app/Http/Controllers/Seller/ProductImageController.php:66
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
 * @see app/Http/Controllers/Seller/ProductImageController.php:66
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
const ProductImageController = { showUploadImages, uploadImages, deleteImage }

export default ProductImageController