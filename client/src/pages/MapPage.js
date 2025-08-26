import React from 'react';
import LoadingPage from './LoadingPage';
import Map from '@/components/map/Map';
import {withContext} from '@/utils/common';
import '@/components/chat/Chat.css';
import '@/components/map/Map.css';

class MapPage extends React.Component {
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
                    this.setState({
                        isLoading: true
                    });
                    clearTimeout(time);
                }, 400);
            }
        }
    };

    render = () => {
        return (
            <section id='chatApp' className='chatApp'>
                {!this.state.isLoading ? <LoadingPage/> : <Map bot={this.state.bot} outletContext={this.props.outletContext}/>}
            </section>
        );
    };
}

export default withContext(MapPage);