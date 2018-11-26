import React, { Component } from 'react';
import Auth from './Auth';
import Chat from './Chat';
import { login } from '../utils/RequestManager';
import { message } from 'antd';

class App extends Component {
    login = (username, password) => {
        login(username, password)
            .then((res) => {
                if ('msg' in res) {
                    message.error(res.msg);
                } else {
                    localStorage.setItem("token", res.token);
                    this.forceUpdate();
                }
            });
    }

    logout = () => {
        localStorage.removeItem("token");
        this.forceUpdate();
    }
    render() {
        if (!localStorage.getItem("token")) {
            return <Auth login={this.login} />
        } else {
            return <Chat logout={this.logout} />
        }
    }
}

export default App;
