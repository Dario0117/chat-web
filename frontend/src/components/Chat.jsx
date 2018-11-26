import React, { Component } from 'react';
import './Chat.css';
import Profile from './Profile';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import { getMyInfo, updateProfilePic } from '../utils/RequestManager';
import io from "socket.io-client";
import HOST from '../settings';
import { Button } from 'antd';
import UserList from './UserList';

export default class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            myName: "",
            myPic: "",
            myID: "",
            selectedChat: "",
            userList: [],
        }
        this.socket = io(HOST);
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
                    myPic: res.profile_pic,
                    myID: res.id,
                });
                this.socket.emit('AUTHENTICATE', {
                    client_id: this.state.myID,
                    name: this.state.myName,
                });
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

    updateUserList = (list) => {
        this.setState({
            userList: list,
        })
    }

    sendMessage = (message) => {
        this.socket.emit('CLIENT_SEND_MESSAGE', {
            message,
            sender_id: this.state.myID,
            conversation_id: this.state.selectedChat,
        });
    }

    render() {
        return (
            <div>
                <div className="split left">
                    <Profile updateProfilePic={this.updatePic} name={this.state.myName} src={this.state.myPic} />
                    <center><Button onClick={this.props.logout} type="primary" className="login-form-button btn-custom" >
                        Logout
                    </Button></center>
                    <ConversationList changeSelectedRoom={this.changeSelectedRoom} />
                </div>

                <div className="split center">
                    <MessageList updateUserList={this.updateUserList} socket={this.socket} sendMessage={this.sendMessage} roomID={this.state.selectedChat} />
                </div>

                <div className="split right">
                    <UserList users={this.state.userList} />
                </div>
            </div>
        )
    }
}
