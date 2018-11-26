import React, { Component } from 'react';
import './Auth.css';
import Login from './Login';
import Register from './Register';

export default class Auth extends Component {
    render() {
        return (
            <div>
                <div className="split-auth left-auth">
                    <div className="login-form-container box-style">
                        <Login login={this.props.login} />
                    </div>
                </div>

                <div className="split-auth center-auth ">
                    <div className="or-form-container">
                        Or...
                    </div>
                </div>

                <div className="split-auth right-auth">
                    <div className="register-form-container box-style">
                        <Register login={this.props.login} register={this.props.register} />
                    </div>
                </div>
            </div>
        )
    }
}
