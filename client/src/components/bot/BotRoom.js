/**
 * Created by @swaibu
 * See https://codepen.io/swaibu/pen/OJLZjLb
 * Modified by @gjgjgjgj58
 */

import React from 'react';
import ChatBox from '@/components/chat/ChatBox';
import { getChatList, sendMessageToSimsimi } from '@/api/api';
import { axiosResponse, detectURL } from '@/utils/common';

export default class BotRoom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            messages: [],
            isTyping: []
        };

        this.sendMessage = this.sendMessage.bind(this);
        this.typing = this.typing.bind(this);
        this.resetTyping = this.resetTyping.bind(this);
    }

    componentDidMount = () => {
        const user = this.props.outletContext.user;
        const roomId = user.roomId;
        this.setState({ user: user });
        this.getMessages(roomId);
    };

    sendMessage = (sender, senderAvatar, message) => {
        const time = setTimeout(() => {
            const newMessageItem = this.createMessageItem(sender, senderAvatar, message);

            this.setMessage(newMessageItem);
            this.setState({ messages: [...this.state.messages, newMessageItem] });
            this.resetTyping(sender);
            clearTimeout(time);
        }, 400);
    };

    typing = (writer) => {
        if (!this.state.isTyping[writer]) {
            let stateTyping = this.state.isTyping;
            stateTyping[writer] = true;
            this.setState({ isTyping: stateTyping });
        }
    };

    resetTyping = (writer) => {
        let stateTyping = this.state.isTyping;
        stateTyping[writer] = false;
        this.setState({ isTyping: stateTyping });
    };

    getMessages = async (roomId) => {
        const res = await getChatList(roomId);

        axiosResponse(
            res,
            () => this.setState({ messages: res.data.chatList }),
            () => alert(res.data.message)
        );
    };

    setMessage = async (newMessageItem) => {
        const time = setTimeout(async () => {
            // TODO
            this.typing(this.props.bot?.sender);

            const messageItem = {
                roomId: this.state.user.roomId,
                ...newMessageItem
            };
            const res = await sendMessageToSimsimi(messageItem);

            axiosResponse(
                res,
                () => {
                    const data = res.data;
                    const newMessageItem = this.createMessageItem(data.sender, data.senderAvatar, data.message);

                    this.setState({ messages: [...this.state.messages, newMessageItem] });
                    this.resetTyping(this.props.bot?.sender);
                },
                () => alert(res.data.message)
            );
            clearTimeout(time);
        }, 400);
    };

    createMessageItem = (sender, senderAvatar, message) => {
        let messageFormat = detectURL(message);
        let newMessageItem = {
            _id: this.state.messages.length + 1,
            sender: sender,
            senderAvatar: senderAvatar,
            message: messageFormat
        };

        return newMessageItem;
    };

    render = () => {
        let users = {};
        let user = this.state.user;
        let chatBoxes = [];
        let messages = this.state.messages;
        let isTyping = this.state.isTyping;
        let sendMessage = this.sendMessage;
        let typing = this.typing;
        let resetTyping = this.resetTyping;

        users[0] = !user ? { name: '', avatar: '' } : { name: user.name, avatar: user.avatar };

        Object.keys(users).map((key) => {
            var user = users[key];
            chatBoxes.push(
                <ChatBox
                    key={key}
                    owner={user.name}
                    ownerAvatar={user.avatar}
                    sendMessage={sendMessage}
                    typing={typing}
                    resetTyping={resetTyping}
                    messages={messages}
                    isTyping={isTyping}
                />
            );
        });
        return <div className={'chatApp__room'}>{chatBoxes}</div>;
    };
}
