import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

connect();

const db = mongoose.connection;

module.exports = { db, connect };
