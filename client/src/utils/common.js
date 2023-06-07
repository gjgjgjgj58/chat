import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const axiosResponse = (res, callback, errorCallback) => {
    if (res.status === 500) {
        // Server Error
        alert(res.data.err.message);
    } else if (res.status === 200) {
        callback();
    } else {
        errorCallback();
    }
};

const setToken = (accessToken, refreshToken) => {
    // TODO
    // set cookies
};
const getAccessToken = () => cookies.get('accessToken');
const getRefreshToken = () => cookies.get('refreshToken');

const navigate = (url) => window.location.replace(url);

const detectURL = (message) => {
    const urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
    return message.replace(urlRegex, (urlMatch) => {
        return `<a href='${urlMatch}'>${urlMatch}</a>`;
    });
};

const withContext = (Component) => (props) => {
    const outletContext = useOutletContext();

    return <Component {...props} outletContext={outletContext} />;
};

const signOut = () => {
    cookies.remove('accessToken');
    cookies.remove('refreshToken');
    window.location.replace('/sign/in');
};

export { axiosResponse, setToken, getAccessToken, getRefreshToken, navigate, detectURL, withContext, signOut };
