import express from 'express';
import RoomService from '@/services/room.service';
import { verifyToken } from '@/utils/interceptor';

const router = express.Router();

router.get('/room/:roomId', verifyToken, async (req, res, next) => {
    try {
        const roomId = req.params.roomId;
        const roomService = new RoomService({ roomId: roomId });
        const result = await roomService.getRoom();

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

module.exports = router;
