import express from 'express';
import { db, connect } from '@/loaders/mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import chatRouter from '@/routes/chat';
import roomRouter from '@/routes/room';
import userRouter from '@/routes/user';
import { check_id } from '@/utils/interceptor';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT;
const SECRET_KEY = process.env.SECRET_KEY;

const handleOpen = () => console.log('Connected to DB');
const handleError = (err) => console.log(`${err}`);

db.once('open', handleOpen);
db.on('error', handleError);
db.on('disconnected', connect);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
    cors({
        origin: true, // TODO for dev
        credential: true // TODO for dev
    })
);
app.use(cookieParser(SECRET_KEY));

app.use('/images', express.static('public/images'));

app.use(check_id);

app.use('/api', chatRouter);
app.use('/api', roomRouter);
app.use('/api', userRouter);

app.listen(port, () => {
    console.log(`${port}`);
});
