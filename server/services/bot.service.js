import { errResponse, serverErrResponse, dataResponse } from '@/utils/common';
import RoomType from '@/config/room.type';
import Bot from '@/models/bot.model';
import Chat from '@/models/chat.model';
import ChatService from './chat.service';

export default class BotService extends ChatService {
    static SIMSIMI_API_URL = process.env.SIMSIMI_API_URL;
    static SIMSIMI_API_KEY = process.env.SIMSIMI_API_KEY;
    static GEMINI_API_URL = process.env.GEMINI_API_URL;
    static GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    constructor(body) {
        super(body);
    }

    sendMessageToSimsimi = async () => {
        try {
            this.bot = new Bot(RoomType.SIMSIMI);
            const chatResult = await this.sendMessage();

            if (chatResult.status !== 200) {
                return chatResult;
            }

            // TODO
            // from fetch to axios
            const botRes = await fetch(BotService.SIMSIMI_API_URL, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'x-api-key': BotService.SIMSIMI_API_KEY
                },
                method: 'POST',
                body: JSON.stringify({
                    utext: this.chat.message,
                    lang: 'ko'
                })
            });

            let atext = '';

            // simsimi status code
            if (botRes.ok) {
                const botJson = await botRes.json();
                atext = botJson.atext;
            } else if (botRes.status === 228) {
                atext = '질문에 대한 답변을 찾을 수 없어요.';
            } else if (botRes.status === 429) {
                atext = '심심이의 한도가 다 되었습니다. 더 이상 채팅할 수 없어요.';
            } else {
                return errResponse(botRes.status, 'Bot Server Error');
            }

            const payload = {
                email: this.bot.email,
                roomId: this.chat.roomId,
                sender: this.bot.sender,
                senderAvatar: this.bot.senderAvatar,
                message: atext
            };

            this.chat = new Chat(payload);

            const botResult = await this.sendMessage();

            if (botResult.status !== 200) {
                return botResult;
            }

            return dataResponse(payload);
        } catch (err) {
            return serverErrResponse(err);
        }
    };

    sendMessageToGemini = async () => {
        try {
            this.bot = new Bot(RoomType.GEMINI);
            const chatResult = await this.sendMessage();

            if (chatResult.status !== 200) {
                return chatResult;
            }

            // TODO
            // from fetch to axios
            const botRes = await fetch(BotService.GEMINI_API_URL, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8',
                    'X-goog-api-key': BotService.GEMINI_API_KEY
                },
                method: 'POST',
                body: JSON.stringify({
                    "contents": [
                        {
                            "parts": [
                                {
                                    "text": this.chat.message,
                                }
                            ]
                        }
                    ]
                })
            });

            let atext = '';

            // gemini status code
            if (botRes.ok) {
                const botJson = await botRes.json();
                console.log(botJson);
                const candidates = botJson.candidates;
                if (candidates && candidates.length > 0) {
                    const parts = candidates[0].content.parts;
                    if (parts && parts.length > 0) {
                        atext = parts[0].text;
                    } else {
                        return errResponse(botRes.status, 'Bot Server Error: Parts Not Found');
                    }
                } else {
                    return errResponse(botRes.status, 'Bot Server Error: Candidates Not Found');
                }
            } else {
                return errResponse(botRes.status, 'Bot Server Error');
            }

            const payload = {
                email: this.bot.email,
                roomId: this.chat.roomId,
                sender: this.bot.sender,
                senderAvatar: this.bot.senderAvatar,
                message: atext
            };

            this.chat = new Chat(payload);

            const botResult = await this.sendMessage();

            if (botResult.status !== 200) {
                return botResult;
            }

            return dataResponse(payload);
        } catch (err) {
            return serverErrResponse(err);
        }
    };
}
