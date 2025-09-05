import RoomType from '@/config/room.type';

export default class Bot {
    constructor(roomType) {
        switch (roomType) {
            case RoomType.SIMSIMI:
                this.email = 'bot_simsimi';
                this.sender = '심심이';
                this.senderAvatar = '/images/chatbot.png';
                break;
            case RoomType.GEMINI:
                this.email = 'bot_gemini';
                this.sender = '제미나이';
                this.senderAvatar = '/images/gemini-color.png';
            default:
                break;
        }
    }
}
