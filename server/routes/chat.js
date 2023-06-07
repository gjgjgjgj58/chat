import express from 'express';
import BotService from '@/services/bot.service';
import ChatService from '@/services/chat.service';
import { verifyToken } from '@/utils/interceptor';

const router = express.Router();

router.get('/chat/:roomId', verifyToken, async (req, res, next) => {
    try {
        const roomId = req.params.roomId;
        const chatService = new ChatService({ roomId: roomId });
        const result = await chatService.getChatList();

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

router.post('/chat/simsimi/send', verifyToken, async (req, res, next) => {
    try {
        const chatService = new BotService(req.body);
        const result = await chatService.sendMessageToSimsimi();

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

module.exports = router;
