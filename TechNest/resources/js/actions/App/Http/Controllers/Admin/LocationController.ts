import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
const index7a810844bca60eb1cfb23da12b6960d5 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index7a810844bca60eb1cfb23da12b6960d5.url(options),
    method: 'get',
})

index7a810844bca60eb1cfb23da12b6960d5.definition = {
    methods: ["get","head"],
    url: '/admin/locations',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
index7a810844bca60eb1cfb23da12b6960d5.url = (options?: RouteQueryOptions) => {
    return index7a810844bca60eb1cfb23da12b6960d5.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
index7a810844bca60eb1cfb23da12b6960d5.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index7a810844bca60eb1cfb23da12b6960d5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
index7a810844bca60eb1cfb23da12b6960d5.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index7a810844bca60eb1cfb23da12b6960d5.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
const index7a810844bca60eb1cfb23da12b6960d5Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7a810844bca60eb1cfb23da12b6960d5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
index7a810844bca60eb1cfb23da12b6960d5Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7a810844bca60eb1cfb23da12b6960d5.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locations'
*/
index7a810844bca60eb1cfb23da12b6960d5Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index7a810844bca60eb1cfb23da12b6960d5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index7a810844bca60eb1cfb23da12b6960d5.form = index7a810844bca60eb1cfb23da12b6960d5Form
/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
const index780b6883f071baa21220ecdec38f26cc = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index780b6883f071baa21220ecdec38f26cc.url(options),
    method: 'get',
})

index780b6883f071baa21220ecdec38f26cc.definition = {
    methods: ["get","head"],
    url: '/admin/locationtest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
index780b6883f071baa21220ecdec38f26cc.url = (options?: RouteQueryOptions) => {
    return index780b6883f071baa21220ecdec38f26cc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
index780b6883f071baa21220ecdec38f26cc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index780b6883f071baa21220ecdec38f26cc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
index780b6883f071baa21220ecdec38f26cc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index780b6883f071baa21220ecdec38f26cc.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
const index780b6883f071baa21220ecdec38f26ccForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index780b6883f071baa21220ecdec38f26cc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
index780b6883f071baa21220ecdec38f26ccForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index780b6883f071baa21220ecdec38f26cc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::index
* @see app/Http/Controllers/Admin/LocationController.php:14
* @route '/admin/locationtest'
*/
index780b6883f071baa21220ecdec38f26ccForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index780b6883f071baa21220ecdec38f26cc.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index780b6883f071baa21220ecdec38f26cc.form = index780b6883f071baa21220ecdec38f26ccForm

export const index = {
    '/admin/locations': index7a810844bca60eb1cfb23da12b6960d5,
    '/admin/locationtest': index780b6883f071baa21220ecdec38f26cc,
}

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
export const listProvinces = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listProvinces.url(options),
    method: 'get',
})

listProvinces.definition = {
    methods: ["get","head"],
    url: '/admin/locations/provinces',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
listProvinces.url = (options?: RouteQueryOptions) => {
    return listProvinces.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
listProvinces.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listProvinces.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
listProvinces.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listProvinces.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
const listProvincesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listProvinces.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
listProvincesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listProvinces.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listProvinces
* @see app/Http/Controllers/Admin/LocationController.php:22
* @route '/admin/locations/provinces'
*/
listProvincesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listProvinces.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listProvinces.form = listProvincesForm

/**
* @see \App\Http\Controllers\Admin\LocationController::storeProvince
* @see app/Http/Controllers/Admin/LocationController.php:33
* @route '/admin/locations/provinces'
*/
export const storeProvince = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProvince.url(options),
    method: 'post',
})

storeProvince.definition = {
    methods: ["post"],
    url: '/admin/locations/provinces',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::storeProvince
* @see app/Http/Controllers/Admin/LocationController.php:33
* @route '/admin/locations/provinces'
*/
storeProvince.url = (options?: RouteQueryOptions) => {
    return storeProvince.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::storeProvince
* @see app/Http/Controllers/Admin/LocationController.php:33
* @route '/admin/locations/provinces'
*/
storeProvince.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeProvince.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::storeProvince
* @see app/Http/Controllers/Admin/LocationController.php:33
* @route '/admin/locations/provinces'
*/
const storeProvinceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeProvince.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::storeProvince
* @see app/Http/Controllers/Admin/LocationController.php:33
* @route '/admin/locations/provinces'
*/
storeProvinceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeProvince.url(options),
    method: 'post',
})

storeProvince.form = storeProvinceForm

/**
* @see \App\Http\Controllers\Admin\LocationController::updateProvince
* @see app/Http/Controllers/Admin/LocationController.php:48
* @route '/admin/locations/provinces/{id}'
*/
export const updateProvince = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProvince.url(args, options),
    method: 'put',
})

updateProvince.definition = {
    methods: ["put"],
    url: '/admin/locations/provinces/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::updateProvince
* @see app/Http/Controllers/Admin/LocationController.php:48
* @route '/admin/locations/provinces/{id}'
*/
updateProvince.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateProvince.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::updateProvince
* @see app/Http/Controllers/Admin/LocationController.php:48
* @route '/admin/locations/provinces/{id}'
*/
updateProvince.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateProvince.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::updateProvince
* @see app/Http/Controllers/Admin/LocationController.php:48
* @route '/admin/locations/provinces/{id}'
*/
const updateProvinceForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProvince.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::updateProvince
* @see app/Http/Controllers/Admin/LocationController.php:48
* @route '/admin/locations/provinces/{id}'
*/
updateProvinceForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateProvince.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateProvince.form = updateProvinceForm

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteProvince
* @see app/Http/Controllers/Admin/LocationController.php:65
* @route '/admin/locations/provinces/{id}'
*/
export const deleteProvince = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProvince.url(args, options),
    method: 'delete',
})

deleteProvince.definition = {
    methods: ["delete"],
    url: '/admin/locations/provinces/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteProvince
* @see app/Http/Controllers/Admin/LocationController.php:65
* @route '/admin/locations/provinces/{id}'
*/
deleteProvince.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteProvince.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteProvince
* @see app/Http/Controllers/Admin/LocationController.php:65
* @route '/admin/locations/provinces/{id}'
*/
deleteProvince.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteProvince.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteProvince
* @see app/Http/Controllers/Admin/LocationController.php:65
* @route '/admin/locations/provinces/{id}'
*/
const deleteProvinceForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteProvince.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteProvince
* @see app/Http/Controllers/Admin/LocationController.php:65
* @route '/admin/locations/provinces/{id}'
*/
deleteProvinceForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteProvince.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteProvince.form = deleteProvinceForm

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
export const listDistricts = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listDistricts.url(args, options),
    method: 'get',
})

listDistricts.definition = {
    methods: ["get","head"],
    url: '/admin/locations/provinces/{provinceId}/districts',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
listDistricts.url = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provinceId: args }
    }

    if (Array.isArray(args)) {
        args = {
            provinceId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provinceId: args.provinceId,
    }

    return listDistricts.definition.url
            .replace('{provinceId}', parsedArgs.provinceId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
listDistricts.get = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listDistricts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
listDistricts.head = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listDistricts.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
const listDistrictsForm = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listDistricts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
listDistrictsForm.get = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listDistricts.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listDistricts
* @see app/Http/Controllers/Admin/LocationController.php:74
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
listDistrictsForm.head = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listDistricts.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listDistricts.form = listDistrictsForm

/**
* @see \App\Http\Controllers\Admin\LocationController::storeDistrict
* @see app/Http/Controllers/Admin/LocationController.php:88
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
export const storeDistrict = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDistrict.url(args, options),
    method: 'post',
})

storeDistrict.definition = {
    methods: ["post"],
    url: '/admin/locations/provinces/{provinceId}/districts',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::storeDistrict
* @see app/Http/Controllers/Admin/LocationController.php:88
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
storeDistrict.url = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { provinceId: args }
    }

    if (Array.isArray(args)) {
        args = {
            provinceId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        provinceId: args.provinceId,
    }

    return storeDistrict.definition.url
            .replace('{provinceId}', parsedArgs.provinceId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::storeDistrict
* @see app/Http/Controllers/Admin/LocationController.php:88
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
storeDistrict.post = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDistrict.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::storeDistrict
* @see app/Http/Controllers/Admin/LocationController.php:88
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
const storeDistrictForm = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeDistrict.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::storeDistrict
* @see app/Http/Controllers/Admin/LocationController.php:88
* @route '/admin/locations/provinces/{provinceId}/districts'
*/
storeDistrictForm.post = (args: { provinceId: string | number } | [provinceId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeDistrict.url(args, options),
    method: 'post',
})

storeDistrict.form = storeDistrictForm

/**
* @see \App\Http\Controllers\Admin\LocationController::updateDistrict
* @see app/Http/Controllers/Admin/LocationController.php:107
* @route '/admin/locations/districts/{id}'
*/
export const updateDistrict = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateDistrict.url(args, options),
    method: 'put',
})

updateDistrict.definition = {
    methods: ["put"],
    url: '/admin/locations/districts/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::updateDistrict
* @see app/Http/Controllers/Admin/LocationController.php:107
* @route '/admin/locations/districts/{id}'
*/
updateDistrict.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateDistrict.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::updateDistrict
* @see app/Http/Controllers/Admin/LocationController.php:107
* @route '/admin/locations/districts/{id}'
*/
updateDistrict.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateDistrict.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::updateDistrict
* @see app/Http/Controllers/Admin/LocationController.php:107
* @route '/admin/locations/districts/{id}'
*/
const updateDistrictForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateDistrict.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::updateDistrict
* @see app/Http/Controllers/Admin/LocationController.php:107
* @route '/admin/locations/districts/{id}'
*/
updateDistrictForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateDistrict.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateDistrict.form = updateDistrictForm

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteDistrict
* @see app/Http/Controllers/Admin/LocationController.php:124
* @route '/admin/locations/districts/{id}'
*/
export const deleteDistrict = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDistrict.url(args, options),
    method: 'delete',
})

deleteDistrict.definition = {
    methods: ["delete"],
    url: '/admin/locations/districts/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteDistrict
* @see app/Http/Controllers/Admin/LocationController.php:124
* @route '/admin/locations/districts/{id}'
*/
deleteDistrict.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteDistrict.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteDistrict
* @see app/Http/Controllers/Admin/LocationController.php:124
* @route '/admin/locations/districts/{id}'
*/
deleteDistrict.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDistrict.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteDistrict
* @see app/Http/Controllers/Admin/LocationController.php:124
* @route '/admin/locations/districts/{id}'
*/
const deleteDistrictForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteDistrict.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteDistrict
* @see app/Http/Controllers/Admin/LocationController.php:124
* @route '/admin/locations/districts/{id}'
*/
deleteDistrictForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteDistrict.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteDistrict.form = deleteDistrictForm

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
export const listWards = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWards.url(args, options),
    method: 'get',
})

listWards.definition = {
    methods: ["get","head"],
    url: '/admin/locations/districts/{districtId}/wards',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
listWards.url = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { districtId: args }
    }

    if (Array.isArray(args)) {
        args = {
            districtId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        districtId: args.districtId,
    }

    return listWards.definition.url
            .replace('{districtId}', parsedArgs.districtId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
listWards.get = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listWards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
listWards.head = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listWards.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
const listWardsForm = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
listWardsForm.get = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWards.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::listWards
* @see app/Http/Controllers/Admin/LocationController.php:133
* @route '/admin/locations/districts/{districtId}/wards'
*/
listWardsForm.head = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: listWards.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

listWards.form = listWardsForm

/**
* @see \App\Http\Controllers\Admin\LocationController::storeWard
* @see app/Http/Controllers/Admin/LocationController.php:147
* @route '/admin/locations/districts/{districtId}/wards'
*/
export const storeWard = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWard.url(args, options),
    method: 'post',
})

storeWard.definition = {
    methods: ["post"],
    url: '/admin/locations/districts/{districtId}/wards',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::storeWard
* @see app/Http/Controllers/Admin/LocationController.php:147
* @route '/admin/locations/districts/{districtId}/wards'
*/
storeWard.url = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { districtId: args }
    }

    if (Array.isArray(args)) {
        args = {
            districtId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        districtId: args.districtId,
    }

    return storeWard.definition.url
            .replace('{districtId}', parsedArgs.districtId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::storeWard
* @see app/Http/Controllers/Admin/LocationController.php:147
* @route '/admin/locations/districts/{districtId}/wards'
*/
storeWard.post = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeWard.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::storeWard
* @see app/Http/Controllers/Admin/LocationController.php:147
* @route '/admin/locations/districts/{districtId}/wards'
*/
const storeWardForm = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWard.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::storeWard
* @see app/Http/Controllers/Admin/LocationController.php:147
* @route '/admin/locations/districts/{districtId}/wards'
*/
storeWardForm.post = (args: { districtId: string | number } | [districtId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: storeWard.url(args, options),
    method: 'post',
})

storeWard.form = storeWardForm

/**
* @see \App\Http\Controllers\Admin\LocationController::updateWard
* @see app/Http/Controllers/Admin/LocationController.php:166
* @route '/admin/locations/wards/{id}'
*/
export const updateWard = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateWard.url(args, options),
    method: 'put',
})

updateWard.definition = {
    methods: ["put"],
    url: '/admin/locations/wards/{id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::updateWard
* @see app/Http/Controllers/Admin/LocationController.php:166
* @route '/admin/locations/wards/{id}'
*/
updateWard.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return updateWard.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::updateWard
* @see app/Http/Controllers/Admin/LocationController.php:166
* @route '/admin/locations/wards/{id}'
*/
updateWard.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateWard.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::updateWard
* @see app/Http/Controllers/Admin/LocationController.php:166
* @route '/admin/locations/wards/{id}'
*/
const updateWardForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWard.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::updateWard
* @see app/Http/Controllers/Admin/LocationController.php:166
* @route '/admin/locations/wards/{id}'
*/
updateWardForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updateWard.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updateWard.form = updateWardForm

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteWard
* @see app/Http/Controllers/Admin/LocationController.php:183
* @route '/admin/locations/wards/{id}'
*/
export const deleteWard = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteWard.url(args, options),
    method: 'delete',
})

deleteWard.definition = {
    methods: ["delete"],
    url: '/admin/locations/wards/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteWard
* @see app/Http/Controllers/Admin/LocationController.php:183
* @route '/admin/locations/wards/{id}'
*/
deleteWard.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return deleteWard.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteWard
* @see app/Http/Controllers/Admin/LocationController.php:183
* @route '/admin/locations/wards/{id}'
*/
deleteWard.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteWard.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteWard
* @see app/Http/Controllers/Admin/LocationController.php:183
* @route '/admin/locations/wards/{id}'
*/
const deleteWardForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteWard.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Admin\LocationController::deleteWard
* @see app/Http/Controllers/Admin/LocationController.php:183
* @route '/admin/locations/wards/{id}'
*/
deleteWardForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: deleteWard.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

deleteWard.form = deleteWardForm

const LocationController = { index, listProvinces, storeProvince, updateProvince, deleteProvince, listDistricts, storeDistrict, updateDistrict, deleteDistrict, listWards, storeWard, updateWard, deleteWard }

export default LocationController