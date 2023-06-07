import React from 'react';
import MessageItem from './MessageItem';

export default class MessageList extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        return (
            <div className={'chatApp__convTimeline'}>
                {this.props.messages
                    .slice(0)
                    .reverse()
                    .map((messageItem) => (
                        <MessageItem
                            key={messageItem._id}
                            owner={this.props.owner}
                            sender={messageItem.sender}
                            senderAvatar={messageItem.senderAvatar}
                            message={messageItem.message}
                        />
                    ))}
            </div>
        );
    };
}
