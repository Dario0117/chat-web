import React, { Component } from 'react';
import './Chat.css';
import Profile from './Profile';
import Conversation from './Conversation';

export default class Chat extends Component {
    render() {
        return (
            <div>
                <div className="split left">
                    <Profile name={"K1d"} src={"https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"}/>
                    <Conversation />
                </div>

                <div className="split right">
                asd
                </div>
            </div>
        )
    }
}
