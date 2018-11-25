import React, { Component } from 'react';
import './Chat.css';
import Profile from './Profile';
import ConversationList from './ConversationList';
import MessageList from './MessageList';
import { getMyInfo, updateProfilePic } from '../utils/RequestManager';
import io from "socket.io-client";
import HOST from '../settings';

export default class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            myName: "",
            myPic: "",
            myID: "",
            selectedChat: "",
        }
        this.socket = io(HOST);

        this.socket.on('SERVER_SEND_MESSAGE', function (data) {
            console.log({ data });
        });
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
                    <ConversationList changeSelectedRoom={this.changeSelectedRoom} />
                </div>

                <div className="split right">
                    <MessageList sendMessage={this.sendMessage} roomID={this.state.selectedChat} />
                </div>
            </div>
        )
    }
}
