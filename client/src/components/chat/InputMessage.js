import React from 'react';
import Button from '@/components/common/Button';

export default class InputMessage extends React.Component {
    constructor(props) {
        super(props);
        this.handleSendMessage = this.handleSendMessage.bind(this);
        this.handleTyping = this.handleTyping.bind(this);
    }

    handleSendMessage = (e) => {
        e.preventDefault();

        if (this.messageInput.value.length > 0) {
            this.props.sendMessageLoading(this.ownerInput.value, this.ownerAvatarInput.value, this.messageInput.value);
            this.messageInput.value = '';
        }
    };

    handleTyping = (e) => {
        if (this.messageInput.value.length > 0) {
            this.props.typing(this.ownerInput.value);
        } else {
            this.props.resetTyping(this.ownerInput.value);
        }
    };

    render = () => {
        const loadingClass = this.props.isLoading ? 'chatApp__convButton--loading' : '';

        return (
            <form onSubmit={this.handleSendMessage}>
                <input type='hidden' ref={(owner) => (this.ownerInput = owner)} value={this.props.owner} />
                <input type='hidden' ref={(ownerAvatar) => (this.ownerAvatarInput = ownerAvatar)} value={this.props.ownerAvatar} />
                <input
                    type='text'
                    ref={(message) => (this.messageInput = message)}
                    className={'chatApp__convInput'}
                    placeholder='Text message'
                    onKeyDown={this.handleTyping}
                    onKeyUp={this.handleTyping}
                    tabIndex='0'
                />
                <Button sendButtonIcon='send' onClick={this.handleSendMessage} loadingClass={loadingClass} />
            </form>
        );
    };
}
