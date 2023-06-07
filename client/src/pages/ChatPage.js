import React from 'react';
import LoadingPage from './LoadingPage';
import BotRoom from '@/components/bot/BotRoom';
import { getRoom } from '@/api/api';
import { withContext } from '@/utils/common';
import '@/components/chat/Chat.css';

class ChatPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    componentDidUpdate = async (prevProps) => {
        if (prevProps.outletContext.user !== this.props.outletContext.user) {
            const user = this.props.outletContext.user;
            if (user) {
                const time = setTimeout(async () => {
                    const res = await getRoom(user.roomId);
                    const isOK = res.status === 200;
                    this.setState({
                        isLoading: isOK,
                        // roomType is 0?
                        bot: isOK && res.data.bot?.sender ? res.data.bot : null
                    });
                    clearTimeout(time);
                }, 400);
            }
        }
    };

    render = () => {
        return (
            <section id='chatApp' className='chatApp'>
                {!this.state.isLoading ? <LoadingPage /> : <BotRoom bot={this.state.bot} outletContext={this.props.outletContext} />}
            </section>
        );
    };
}

export default withContext(ChatPage);
