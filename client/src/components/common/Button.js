import React from 'react';

export default class Button extends React.Component {
    onClickButton = async (e) => {
        this.props.onClick?.(e);
    };

    render = () => (
        <div className={`chatApp__convButton ${this.props.loadingClass ? this.props.loadingClass : ''}`} onClick={this.onClickButton}>
            <i className={'material-icons'}>{this.props.sendButtonIcon}</i>
        </div>
    );
}
