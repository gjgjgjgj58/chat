import { getAccessTokenCookies } from './common';
import UserService from '@/services/user.service';

const verifyToken = async (req, res, next) => {
    const token = getAccessTokenCookies(req);

    if (token) {
        const result = await UserService.verify(token);

        if (result.status !== 200) {
            return res.status(result.status).send(result.message);
        }

        next();
    } else {
        return res.status(400).send({
            success: false,
            message: '토큰이 정상적으로 확인되지 않습니다.'
        });
    }
};

const check_id = async (req, res, next) => {
    if (req.body._id) {
        delete req.body._id;
    }

    next();
};

module.exports = { verifyToken, check_id };
