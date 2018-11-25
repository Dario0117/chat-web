import React, { Component } from 'react';
import './Chat.css';
import Profile from './Profile';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import { getMyInfo, updateProfilePic } from '../utils/RequestManager';

export default class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            myName: "",
            myPic: "",
            selectedChat: 1,
            data: []
        }
    }

    updatePic = (image) => {
        updateProfilePic(image)
            .then(this.refreshProfile);
    }

    refreshProfile = () => {
        getMyInfo()
            .then((res) => {
                this.setState({
                    myName: res.name,
                    myPic: res.profile_pic
                })
            });
    }

    componentDidMount = () => {
        this.refreshProfile();
    }

    changeSelectedRoom = (room_id) => {
        this.setState({
            selectedChat: room_id,
        })
    }

    render() {
        return (
            <div>
                <div className="split left">
                    <Profile updateProfilePic={this.updatePic} name={this.state.myName} src={this.state.myPic} />
                    <ConversationList changeSelectedRoom={this.changeSelectedRoom} />
                </div>

                <div className="split right">
                    <MessageList roomID={this.state.selectedChat} />
                </div>
            </div>
        )
    }
}
