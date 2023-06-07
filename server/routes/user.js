import express from 'express';
import { serverErrResponse, getAccessTokenCookies, getRefreshTokenCookies } from '@/utils/common';
import UserService from '@/services/user.service';

const router = express.Router();

router.get('/validation', async (req, res, next) => {
    try {
        const token = getAccessTokenCookies(req);
        const result = await UserService.verify(token);

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

router.get('/refresh', async (req, res, next) => {
    try {
        const token = getRefreshTokenCookies(req);
        const result = await UserService.refresh(token);

        if (result.message.accessToken) {
            const expiry = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7); // 7d
            const cookieConfig = { expires: expiry, httpOnly: true, signed: true };
            res.cookie('accessToken', result.message.accessToken, cookieConfig);

            delete result.message.accessToken;
        }

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

router.post('/sign/in', async (req, res, next) => {
    try {
        const service = new UserService(req.body);
        const result = await service.signIn();

        if (result.message.accessToken && result.message.refreshToken) {
            const expiry = new Date(Date.now() + 60 * 60 * 1000 * 24 * 7); // 7d
            const cookieConfig = { expires: expiry, httpOnly: true, signed: true };
            res.cookie('accessToken', result.message.accessToken, cookieConfig);
            res.cookie('refreshToken', result.message.refreshToken, cookieConfig);

            delete result.message.accessToken;
            delete result.message.refreshToken;
        }

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

router.post('/sign/out', async (req, res, next) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).send({ success: true });
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

router.post('/sign/up', UserService.saveAvatarFile(), async (req, res, next) => {
    try {
        const service = new UserService(req.body);
        const result = await service.signUp(req.file);

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

module.exports = router;
