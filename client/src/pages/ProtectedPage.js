import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { validation } from '@/api/api';

export default class ProtectedPage extends React.Component {
    state = {
        isAuth: true,
        user: null
    };

    componentDidMount = async () => {
        const res = await validation();
        const isOK = res.status === 200;
        this.setState({
            isAuth: isOK,
            user: isOK ? res.data : null
        });
    };

    render = () => {
        if (!this.state.isAuth) {
            alert('로그인이 필요한 서비스입니다.');
            return <Navigate to='/sign/in' />;
        }

        return <Outlet context={{ user: this.state.user }} />;
    };
}
