import instance from '@/utils/instance';

const validation = async () => {
    return instance.get('/validation');
};

const refresh = async () => {
    return instance.get('/refresh');
};

const signIn = async (user) => {
    return instance.post('/sign/in', user);
};

const signOut = async () => {
    return instance.post('/sign/out');
};

const signUp = async (formData) => {
    return instance.post('/sign/up', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
};

const getRoom = async (roomId) => {
    return instance.get(`/room/${roomId}`);
};

const getChatList = async (roomId) => {
    return instance.get(`/chat/${roomId}`);
};

const sendMessageToSimsimi = async (chat) => {
    return instance.post('/chat/simsimi/send', chat);
};

export { validation, refresh, signIn, signOut, signUp, getRoom, getChatList, sendMessageToSimsimi };
