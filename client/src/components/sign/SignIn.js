/**
 * Created by Nitesh Kumar Niranjan
 * See https://www.codehim.com/collections/login-page-in-html-with-css-code/
 * Modified by @gjgjgjgj58
 */

import React from 'react';
import { signIn } from '@/api/api';
import { axiosResponse, navigate } from '@/utils/common';

export default class SignIn extends React.Component {
    state = {
        email: '',
        password: '',
        err: ''
    };

    handleErr = (errText) => {
        this.setState({ err: !errText ? '' : errText });
    };

    handleEmail = (e) => {
        this.handleErr();
        this.setState({ email: e.currentTarget.value });
    };

    handlePassword = (e) => {
        this.handleErr();
        this.setState({ password: e.currentTarget.value });
    };

    onClickSignInHander = async (e) => {
        e.preventDefault();

        if (!this.state.email) {
            return this.handleErr('이메일을 입력해주세요.');
        }

        if (!this.state.password) {
            return this.handleErr('비밀번호를 입력해주세요.');
        }

        const user = {
            email: this.state.email,
            password: this.state.password
        };
        const res = await signIn(user);

        axiosResponse(
            res,
            () => navigate('/'),
            () => this.handleErr(res.data.message)
        );
    };

    onClickSignUpHander = async (e) => {
        e.preventDefault();

        navigate('/sign/up');
    };

    render = () => {
        return (
            <div className='login-form'>
                <form>
                    <h1>Sign In</h1>
                    <div className='content'>
                        <div className='input-field'>
                            <input type='email' placeholder='Email' autoComplete='nope' onChange={this.handleEmail} />
                        </div>
                        <div className='input-field'>
                            <input type='password' placeholder='Password' autoComplete='new-password' onChange={this.handlePassword} />
                        </div>
                        <div className='error-field'>
                            <span>{this.state.err}</span>
                        </div>
                        <a href='#' className='link'>
                            Forgot Your Password?
                        </a>
                    </div>
                    <div className='action'>
                        <button onClick={this.onClickSignInHander}>Sign In</button>
                        <button onClick={this.onClickSignUpHander}>Sign Up</button>
                    </div>
                </form>
            </div>
        );
    };
}
