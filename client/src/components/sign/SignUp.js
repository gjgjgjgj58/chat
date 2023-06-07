import React from 'react';
import Avatar from '@/components/common/Avatar';
import { signUp } from '@/api/api';
import { axiosResponse, navigate } from '@/utils/common';

export default class SignUp extends React.Component {
    state = {
        email: '',
        name: '',
        password: '',
        passwordConfirm: '',
        avatar: '',
        avatarFile: null,
        err: ''
    };

    handleErr = (errText) => {
        this.setState({ err: !errText ? '' : errText });
    };

    handleEmail = (e) => {
        this.handleErr();
        this.setState({ email: e.currentTarget.value });
    };

    handleName = (e) => {
        this.handleErr();
        this.setState({ name: e.currentTarget.value });
    };

    handlePassword = (e) => {
        this.handleErr();
        this.setState({ password: e.currentTarget.value });
    };

    handlePasswordConfirm = (e) => {
        this.handleErr();
        this.setState({ passwordConfirm: e.currentTarget.value });
    };

    onSubmitSignUpHandler = async (e) => {
        e.preventDefault();

        if (this.state.password.length < 4 || this.state.passwordConfirm < 4) {
            return this.handleErr('사용 가능한 비밀번호 자릿수는 4자리 이상입니다.');
        }

        if (this.state.password !== this.state.passwordConfirm) {
            return this.handleErr('비밀번호와 비밀번호 확인이 다릅니다.');
        }

        const formData = new FormData();

        formData.append('email', this.state.email);
        formData.append('name', this.state.name);
        formData.append('password', this.state.password);
        formData.append('avatar', this.state.avatarFile);

        const res = await signUp(formData);

        axiosResponse(
            res,
            () => {
                alert('회원가입이 완료됐습니다. 다시 로그인해 주세요.');
                navigate('/sign/in');
            },
            () => this.handleErr(res.data.message)
        );
    };

    handleAvatar = (e) => {
        this.handleErr();
        e.preventDefault();

        const fileReader = new FileReader();
        const file = e.target.files[0];

        if (file) {
            fileReader.readAsDataURL(file);
        } else {
            this.setState({ avatar: '', avatarFile: null });
        }

        fileReader.onload = () => {
            this.setState({ avatar: fileReader.result, avatarFile: file });
        };
    };

    render = () => {
        return (
            <div className='login-form'>
                <form onSubmit={this.onSubmitSignUpHandler} encType='multipart/form-data'>
                    <h1>Sign Up</h1>
                    <div className='content'>
                        <div className='input-field'>
                            <span required>이메일</span>
                            <input type='email' placeholder='Email' autoComplete='nope' onChange={this.handleEmail} required />
                        </div>
                        <div className='input-field'>
                            <span required>이름</span>
                            <input type='text' placeholder='Name' autoComplete='nope' onChange={this.handleName} required />
                        </div>
                        <div className='input-field'>
                            <span required>비밀번호</span>
                            <input type='password' placeholder='Password' autoComplete='new-password' onChange={this.handlePassword} required />
                        </div>
                        <div className='input-field'>
                            <span required>비밀번호 확인</span>
                            <input type='password' placeholder='Confirm Password' autoComplete='new-password' onChange={this.handlePasswordConfirm} required />
                        </div>
                        <div className='input-field'>
                            <span>아바타</span>
                            <div className='avatar-field'>
                                <Avatar width='160' height='160' avatar={this.state.avatar} />
                                <input type='file' name='avatar' accept='image/*' onChange={this.handleAvatar} />
                            </div>
                        </div>
                        <div className='error-field'>
                            <span>{this.state.err}</span>
                        </div>
                    </div>
                    <div className='action'>
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            </div>
        );
    };
}
