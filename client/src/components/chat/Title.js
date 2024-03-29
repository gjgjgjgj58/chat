import React from 'react';
import Button from '@/components/common/Button';
import { signOut } from '@/api/api';
import { axiosResponse, navigate } from '@/utils/common';

export default class Title extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSignOut = async (e) => {
        e.preventDefault();

        if (confirm('로그아웃 하시겠습니까?')) {
            const res = await signOut();

            axiosResponse(
                res,
                () => navigate('/sign/in'),
                () => alert(res.data.message)
            );
        }
    };

    render = () => {
        return (
            <>
                <div className={'chatApp__convTitle'}>{this.props.owner}'s display</div>
                <Button sendButtonIcon='logout' onClick={this.handleSignOut} />
            </>
        );
    };
}
