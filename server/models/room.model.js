import mongoose from 'mongoose';
import RoomType from '@/config/room.type';

const schema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    roomId: {
        type: String
    },
    roomType: {
        type: Number,
        default: RoomType.NORMAL.code
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Room = mongoose.model('Room', schema);

module.exports = Room;
