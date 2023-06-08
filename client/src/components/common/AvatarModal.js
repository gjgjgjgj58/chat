import React from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import Button from './Button';

const Overlay = styled.div`
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
`;

const fadeModal = keyframes`
    0% {
        opacity: 0;
        transform: translateY(1rem);
    }
    100% {
        opacity: 1;
        transform: translateY(0px);
    }
`;

const ModalWrapper = styled.div`
    width: 600px;
    height: 600px;
    border-radius: 50%;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    animation: ${fadeModal} 0.3s ease-in-out;
    animation-fill-mode: forwards;
`;

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 100%;
`;

const Content = styled.div`
    width: 600px;
    height: 600px;
    border-radius: 50%;
    position: absolute;
    overflow: hidden;
`;

const Img = styled.img`
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
`;

const AvatarModalContainer = ({ children }) => {
    return ReactDOM.createPortal(children, document.getElementById('modal'));
};

export const AvatarModal = ({ onClose, src }) => {
    const handleClose = () => {
        onClose?.();
    };

    return (
        <AvatarModalContainer>
            <Overlay>
                <ModalWrapper>
                    <ButtonWrapper>
                        <Button sendButtonIcon='close' onClick={handleClose} />
                    </ButtonWrapper>
                    <Content>
                        <Img src={src} />
                    </Content>
                </ModalWrapper>
            </Overlay>
        </AvatarModalContainer>
    );
};

export const AvatarModalContext = React.createContext({
    onOpen: () => {},
    src: ''
});
