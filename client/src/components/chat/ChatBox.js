import React from 'react';
import Title from './Title';
import MessageList from './MessageList';
import TypingIndicator from './TypingIndicator';
import InputMessage from './InputMessage';

export default class ChatBox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };

        this.sendMessageLoading = this.sendMessageLoading.bind(this);
    }

    sendMessageLoading = (sender, senderAvatar, message) => {
        this.setState({ isLoading: true });
        this.props.sendMessage(sender, senderAvatar, message);
        const time = setTimeout(() => {
            this.setState({ isLoading: false });
            clearTimeout(time);
        }, 400);
    };

    render = () => {
        return (
            <div className={'chatApp__conv'}>
                <Title owner={this.props.owner} />
                <MessageList owner={this.props.owner} messages={this.props.messages} />
                <div className={'chatApp__convSendMessage clearfix'}>
                    <TypingIndicator owner={this.props.owner} isTyping={this.props.isTyping} />
                    <InputMessage
                        isLoading={this.state.isLoading}
                        owner={this.props.owner}
                        ownerAvatar={this.props.ownerAvatar}
                        sendMessage={this.props.sendMessage}
                        sendMessageLoading={this.sendMessageLoading}
                        typing={this.props.typing}
                        resetTyping={this.props.resetTyping}
                    />
                </div>
            </div>
        );
    };
}
