import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Chat\ChatBotController::chat
 * @see app/Http/Controllers/Chat/ChatBotController.php:11
 * @route '/api/chat/chatbot'
 */
export const chat = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: chat.url(options),
    method: 'post',
})

chat.definition = {
    methods: ["post"],
    url: '/api/chat/chatbot',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Chat\ChatBotController::chat
 * @see app/Http/Controllers/Chat/ChatBotController.php:11
 * @route '/api/chat/chatbot'
 */
chat.url = (options?: RouteQueryOptions) => {
    return chat.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Chat\ChatBotController::chat
 * @see app/Http/Controllers/Chat/ChatBotController.php:11
 * @route '/api/chat/chatbot'
 */
chat.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: chat.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Chat\ChatBotController::chat
 * @see app/Http/Controllers/Chat/ChatBotController.php:11
 * @route '/api/chat/chatbot'
 */
    const chatForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: chat.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Chat\ChatBotController::chat
 * @see app/Http/Controllers/Chat/ChatBotController.php:11
 * @route '/api/chat/chatbot'
 */
        chatForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: chat.url(options),
            method: 'post',
        })
    
    chat.form = chatForm
const ChatBotController = { chat }

export default ChatBotController