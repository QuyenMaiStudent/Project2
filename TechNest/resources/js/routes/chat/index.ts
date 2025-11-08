import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import messages from './messages'
/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
export const chatbot = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chatbot.url(options),
    method: 'get',
})

chatbot.definition = {
    methods: ["get","head"],
    url: '/chat/chatbot',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
chatbot.url = (options?: RouteQueryOptions) => {
    return chatbot.definition.url + queryParams(options)
}

/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
chatbot.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chatbot.url(options),
    method: 'get',
})

/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
chatbot.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chatbot.url(options),
    method: 'head',
})

/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
const chatbotForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chatbot.url(options),
    method: 'get',
})

/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
chatbotForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chatbot.url(options),
    method: 'get',
})

/**
* @see routes/web.php:29
* @route '/chat/chatbot'
*/
chatbotForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chatbot.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

chatbot.form = chatbotForm

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/chat',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::index
* @see app/Http/Controllers/Chat/ChatController.php:13
* @route '/chat'
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
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
export const show = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/chat/{conversation}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
show.url = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conversation: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { conversation: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            conversation: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        conversation: typeof args.conversation === 'object'
        ? args.conversation.id
        : args.conversation,
    }

    return show.definition.url
            .replace('{conversation}', parsedArgs.conversation.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
show.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
show.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
const showForm = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
showForm.get = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::show
* @see app/Http/Controllers/Chat/ChatController.php:28
* @route '/chat/{conversation}'
*/
showForm.head = (args: { conversation: string | number | { id: string | number } } | [conversation: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Chat\ChatController::start
* @see app/Http/Controllers/Chat/ChatController.php:74
* @route '/chat/start'
*/
export const start = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

start.definition = {
    methods: ["post"],
    url: '/chat/start',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Chat\ChatController::start
* @see app/Http/Controllers/Chat/ChatController.php:74
* @route '/chat/start'
*/
start.url = (options?: RouteQueryOptions) => {
    return start.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Chat\ChatController::start
* @see app/Http/Controllers/Chat/ChatController.php:74
* @route '/chat/start'
*/
start.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::start
* @see app/Http/Controllers/Chat/ChatController.php:74
* @route '/chat/start'
*/
const startForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Chat\ChatController::start
* @see app/Http/Controllers/Chat/ChatController.php:74
* @route '/chat/start'
*/
startForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: start.url(options),
    method: 'post',
})

start.form = startForm

const chat = {
    chatbot: Object.assign(chatbot, chatbot),
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    messages: Object.assign(messages, messages),
    start: Object.assign(start, start),
}

export default chat