import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    name: {
        type: String,
        maxlength: 50
    },
    password: {
        type: String,
        minlength: 4
    },
    avatar: {
        type: String
    },
    roomId: {
        type: String
    },
    refreshToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', schema);

module.exports = User;
