const errResponse = (code, message) => {
    return {
        status: code,
        message: {
            success: false,
            message: message
        }
    };
};

const serverErrResponse = (err) => {
    if (!err || Object.keys(err).length === 0) {
        err = { message: 'Server Error' };
    }

    return {
        status: 500,
        message: {
            success: false,
            err
        }
    };
};

const dataResponse = (data) => {
    return {
        status: 200,
        message: {
            success: true,
            ...data
        }
    };
};

const getTokenHeader = (req) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }

    return null;
};

const getAccessTokenCookies = (req) => {
    if (req.signedCookies?.accessToken) {
        return req.signedCookies?.accessToken;
    }

    return null;
};

const getRefreshTokenCookies = (req) => {
    if (req.signedCookies?.refreshToken) {
        return req.signedCookies?.refreshToken;
    }

    return null;
};

export { errResponse, serverErrResponse, dataResponse, getTokenHeader, getAccessTokenCookies, getRefreshTokenCookies };
