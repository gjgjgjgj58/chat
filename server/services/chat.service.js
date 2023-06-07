import { serverErrResponse, dataResponse } from '@/utils/common';
import Chat from '@/models/chat.model';

export default class ChatService {
    constructor(body) {
        this.chat = new Chat(body);
    }

    getChatList = async () => {
        try {
            const chatList = await Chat.find({ roomId: this.chat.roomId });

            return dataResponse({ chatList: chatList });
        } catch (err) {
            return serverErrResponse(err);
        }
    };

    sendMessage = async () => {
        try {
            await this.chat.save();

            return dataResponse({});
        } catch (err) {
            return serverErrResponse(err);
        }
    };
}
