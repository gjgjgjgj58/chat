import axios from 'axios';
import { refresh } from '@/api/api';
import { getAccessToken } from '@/utils/common';

const instance = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
        Expires: '0'
    },
    withCredentials: true // TODO for dev
});

instance.interceptors.request.use(
    (config) => {
        const token = getAccessToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (err) => Promise.reject(err)
);

instance.interceptors.response.use(
    (res) => res,
    async (err) => {
        const prevStatus = err.response.status;
        const prevURL = err.request.responseURL;
        const prevConfig = err.config;

        if ((prevStatus === 419 || prevStatus === 403) && !prevURL.endsWith('refresh')) {
            const res = await refresh();

            if (res.status === 200) {
                return await axios(prevConfig);
            }
        }

        return err.response;
    }
);

export default instance;
