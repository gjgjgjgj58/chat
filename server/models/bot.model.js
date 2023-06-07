import RoomType from '@/config/room.type';

export default class Bot {
    constructor(roomType) {
        switch (roomType) {
            case RoomType.SIMSIMI:
                this.email = 'bot_simsimi';
                this.sender = '심심이';
                this.senderAvatar = '/images/chatbot.png';
                break;
            default:
                break;
        }
    }
}
