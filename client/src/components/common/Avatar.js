import React from 'react';
import styled from 'styled-components';
import { AvatarModalContext as ModalContext } from './AvatarModal';

const Img = styled.img`
    width: ${(props) => (!props.width ? 40 : props.width)}px;
    height: ${(props) => (!props.height ? 40 : props.height)}px;
    border-radius: 50%;
    object-fit: cover;
    margin: auto;
    image-rendering: -webkit-optimize-contrast;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    content: url(${(props) => (!props.avatar ? '/images/user.png' : props.avatar)});
    cursor: pointer;
    image-rendering: -moz-crisp-edges;
    image-rendering: -o-crisp-edges;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    transform: translateZ(0);
    backface-visibility: hidden;
`;

export default class Avatar extends React.Component {
    static contextType = ModalContext;

    constructor(props) {
        super(props);
        this.state = {
            defaultSrc: '/images/user.png'
        };
    }

    openModal = () => {
        const src = !this.props.avatar ? '/images/user.png' : this.props.avatar;
        this.context.setContent?.(src);
        this.context.open?.();
    };

    onErrorImgHandler = (e) => {
        e.currentTarget.src = this.state.defaultSrc;
    };

    render = () => {
        return (
            <Img
                avatar={this.props.avatar}
                width={this.props.width}
                height={this.props.height}
                alt={this.props.sender}
                onError={this.onErrorImgHandler}
                className='message-avatar'
                onClick={this.openModal}
            />
        );
    };
}
