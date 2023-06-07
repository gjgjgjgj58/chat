import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import multer, { diskStorage } from 'multer';
import { errResponse, serverErrResponse, dataResponse } from '@/utils/common';
import RoomType from '@/config/room.type';
import User from '@/models/user.model';
import RoomService from './room.service';

export default class UserService {
    static JWT_KEY = process.env.SECRET_KEY;

    constructor(body) {
        this.user = new User(body);
    }

    static verifyToken = (token) => {
        return jwt.verify(token, this.JWT_KEY);
    };

    static issueAccessToken = (payload) => {
        return jwt.sign(payload, this.JWT_KEY, {
            expiresIn: '1h'
        });
    };

    static issueRefreshToken = (payload) => {
        return jwt.sign(payload, this.JWT_KEY, {
            expiresIn: '7d'
        });
    };

    static verify = async (token) => {
        let decoded = null;

        try {
            decoded = this.verifyToken(token);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return errResponse(419, '만료된 토큰입니다.');
            }

            return errResponse(403, '유효하지 않은 토큰입니다.');
        }

        if (!decoded) {
            return errResponse(403, '유효하지 않은 토큰입니다.');
        }

        return dataResponse(decoded);
    };

    static refresh = async (token) => {
        try {
            const result = await this.verify(token);

            if (result.status !== 200) {
                return result;
            }

            const email = result.message.email;
            const user = await User.findOne({ email: email });

            if (!user.refreshToken || user.refreshToken !== token) {
                // TODO
                // reissue refresh token
                return errResponse(403, '유효하지 않은 토큰입니다.');
            }

            const payload = {
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                roomId: user.roomId
            };

            const accessToken = this.issueAccessToken(payload);

            return dataResponse({ accessToken: accessToken, refreshToken: user.refreshToken });
        } catch (err) {
            return serverErrResponse(err);
        }
    };

    static createAvatarFileName = (originalname) => {
        const today = new Date().valueOf().toString();
        const extension = '.' + originalname.split('.').reverse()[0];

        return (
            crypto
                .createHash('sha256')
                .update(today + originalname)
                .digest('hex') + extension
        );
    };

    static saveAvatarFile = () => {
        const storage = diskStorage({
            destination: (req, file, callback) => {
                callback(null, 'public/images');
            },
            filename: (req, file, callback) => {
                callback(null, this.createAvatarFileName(file.originalname));
            }
        });

        return multer({ storage: storage }).single('avatar');
    };

    signIn = async () => {
        try {
            const filter = { email: this.user.email };
            const user = await User.findOne(filter);

            if (!user) {
                return errResponse(401, '존재하지 않는 계정입니다.');
            }

            if (user && !bcrypt.compareSync(this.user.password, user.password)) {
                return errResponse(401, '잘못된 비밀번호를 입력했습니다.');
            }

            const payload = {
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                roomId: user.roomId
            };

            const accessToken = UserService.issueAccessToken(payload);
            const refreshToken = UserService.issueRefreshToken(payload);

            const update = { refreshToken: refreshToken };
            const doc = await User.findOneAndUpdate(filter, update, { new: true, returnOriginal: false });

            if (!doc.refreshToken) {
                return serverErrResponse();
            }

            return dataResponse({ ...payload, accessToken: accessToken, refreshToken: refreshToken });
        } catch (err) {
            return serverErrResponse(err);
        }
    };

    signUp = async (file) => {
        try {
            const roomId = RoomService.createRoomId();

            this.user.password = bcrypt.hashSync(this.user.password, 10);
            this.user.roomId = roomId;
            this.user.avatar = !file ? '/images/user.png' : '/images/' + file.filename;

            const payload = {
                email: this.user.email,
                name: this.user.name,
                avatar: this.user.avatar,
                roomId: this.user.roomId
            };

            this.user.refreshToken = UserService.issueRefreshToken(payload);

            try {
                await this.user.save();
            } catch (err) {
                if (err.code === 11000) {
                    return errResponse(409, '이미 가입된 이메일입니다.');
                }

                return serverErrResponse(err);
            }

            const roomService = new RoomService(payload);
            // TODO
            // create bot(simsimi) room
            const roomResult = await roomService.createRoom(RoomType.SIMSIMI);

            if (roomResult.status !== 200) {
                return roomResult;
            }

            return dataResponse({});
        } catch (err) {
            console.error(err);
            return serverErrResponse(err);
        }
    };
}
