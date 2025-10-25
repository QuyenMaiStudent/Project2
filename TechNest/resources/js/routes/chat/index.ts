import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:36
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
* @see routes/web.php:36
* @route '/chat/chatbot'
*/
chatbot.url = (options?: RouteQueryOptions) => {
    return chatbot.definition.url + queryParams(options)
}

/**
* @see routes/web.php:36
* @route '/chat/chatbot'
*/
chatbot.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: chatbot.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/chat/chatbot'
*/
chatbot.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: chatbot.url(options),
    method: 'head',
})

/**
* @see routes/web.php:36
* @route '/chat/chatbot'
*/
const chatbotForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chatbot.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/chat/chatbot'
*/
chatbotForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: chatbot.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
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

const chat = {
    chatbot: Object.assign(chatbot, chatbot),
}

export default chat