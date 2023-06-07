import React from 'react';
import '@/components/chat/Chat.css';

export default class LoadingPage extends React.Component {
    render = () => (
        <div className='chatApp__loaderWrapper'>
            <div className='chatApp__loaderText'>Loading...</div>
            <div className='chatApp__loader'></div>
        </div>
    );
}
