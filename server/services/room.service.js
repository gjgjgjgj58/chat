import crypto from 'crypto';
import { errResponse, serverErrResponse, dataResponse } from '@/utils/common';
import Bot from '@/models/bot.model';
import Room from '@/models/room.model';

export default class RoomService {
    constructor(body) {
        this.room = new Room(body);
    }

    static createRoomId = () => {
        return crypto.randomUUID();
    };

    getRoom = async () => {
        try {
            const room = await Room.findOne({ roomId: this.room.roomId });

            if (!room) {
                return errResponse(401, '존재하지 않는 방입니다.');
            }

            const payload = {
                roomType: room.roomType,
                bot: new Bot(room.roomType)
            };

            return dataResponse(payload);
        } catch (err) {
            return serverErrResponse(err);
        }
    };

    createRoom = async (roomType) => {
        try {
            this.room.roomType = roomType;

            await this.room.save();

            return dataResponse({});
        } catch (err) {
            return serverErrResponse(err);
        }
    };
}
