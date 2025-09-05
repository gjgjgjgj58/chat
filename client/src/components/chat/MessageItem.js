import React from 'react';
import Avatar from '@/components/common/Avatar';

export default class MessageItem extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        const messagePosition = this.props.owner == this.props.sender ? 'chatApp__convMessageItem--right' : 'chatApp__convMessageItem--left';
        const htmlMessage = this.props.message?.replace(/\n/g, '<br/>');

        return (
            <div className={`chatApp__convMessageItem clearfix ${messagePosition}`}>
                <Avatar avatar={this.props.senderAvatar} sender={this.props.sender} />
                <div className='chatApp__convMessageValue' dangerouslySetInnerHTML={{ __html: htmlMessage }}></div>
            </div>
        );
    };
}
