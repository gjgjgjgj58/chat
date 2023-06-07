import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import ProtectedPage from './pages/ProtectedPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import ChatPage from './pages/ChatPage';
import { AvatarModal as Modal, AvatarModalContext as ModalContext } from './components/common/AvatarModal';
import './App.css';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false,
            modalContent: ''
        };
    }

    openModal = () => {
        this.setState({ isOpen: true });
    };

    closeModal = () => {
        this.setState({ isOpen: false });
    };

    setModalContent = (content) => {
        this.setState({ modalContent: content });
    };

    render = () => {
        return (
            <CookiesProvider>
                <ModalContext.Provider value={{ open: this.openModal, setContent: this.setModalContent }}>
                    <BrowserRouter>
                        <Routes>
                            <Route path='/sign/in' element={<SignInPage />} />
                            <Route path='/sign/up' element={<SignUpPage />} />
                            <Route element={<ProtectedPage />}>
                                <Route path='/' element={<ChatPage />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </ModalContext.Provider>
                {this.state.isOpen && <Modal onClose={this.closeModal} src={this.state.modalContent} />}
            </CookiesProvider>
        );
    };
}
