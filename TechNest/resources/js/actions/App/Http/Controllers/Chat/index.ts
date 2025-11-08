import ChatBotController from './ChatBotController'
import ChatController from './ChatController'

const Chat = {
    ChatBotController: Object.assign(ChatBotController, ChatBotController),
    ChatController: Object.assign(ChatController, ChatController),
}

export default Chat