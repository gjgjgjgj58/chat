import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: {
        type: String,
        trim: true
    },
    roomId: {
        type: String
    },
    sender: {
        type: String,
        maxlength: 50
    },
    senderAvatar: {
        type: String
    },
    message: {
        type: String
    },
    sentAt: {
        type: Date,
        default: Date.now
    }
});

const Chat = mongoose.model('Chat', schema, 'chat');

module.exports = Chat;
