import React from 'react';

export default class TypingIndicator extends React.Component {
    constructor(props) {
        super(props);
    }

    render = () => {
        let typersDisplay = '';
        let countTypers = 0;

        for (let key in this.props.isTyping) {
            if (key != this.props.owner && this.props.isTyping[key]) {
                typersDisplay += ', ' + key;
                countTypers++;
            }
        }

        typersDisplay = typersDisplay.substr(1);
        typersDisplay += countTypers > 1 ? ' are ' : ' is ';

        if (countTypers > 0) {
            return (
                <div className={'chatApp__convTyping'}>
                    {typersDisplay} writing
                    <span className={'chatApp__convTypingDot'}></span>
                </div>
            );
        }

        return <div className={'chatApp__convTyping'}></div>;
    };
}
