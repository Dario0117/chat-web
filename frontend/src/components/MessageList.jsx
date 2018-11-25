import React, { Component } from 'react';
import { Input, List, Avatar } from 'antd';
import './MessageList.css';
import {
    getInfoFromRoom, getUsersFromRoom
} from '../utils/RequestManager';
import default_pic from './default_pic.png';

const Title = (props) => {
    return (
        <>
            <span>{props.name}</span><span className="message-user-date">{props.date}</span>
        </>
    );
}

export default class MessageList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            chatName: "",
            messages: [],
            users: {},
        }
        this.ready = true;
    }

    dateParser = (date) => {
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
        let day = pad(date.getDate());
        let month = pad(date.getMonth() + 1);
        let year = date.getFullYear();
        let hour = pad(date.getHours());
        let minute = pad(date.getMinutes());
        let second = pad(date.getSeconds());
        let date_parsed = `${day}/${month}/${year} ${hour}:${minute}:${second}`;
        return date_parsed;
    }

    refreshState = () => {
        this.ready = false;
        Promise.all([
            getUsersFromRoom(this.props.roomID),
            getInfoFromRoom(this.props.roomID),
        ])
            .then((results) => {
                let parsedUsers = {};
                for (let user of results[0]) {
                    parsedUsers[user.id] = {
                        profile_pic: user.profile_pic || default_pic,
                        name: user.name,
                    }
                }
                this.setState({
                    chatName: results[1].name,
                    users: parsedUsers,
                    messages: results[1].messages.map((msg) => {
                        let m = { ...msg };
                        m.date = this.dateParser(new Date(m.date));
                        return m;
                    }),
                });
                this.ready = true;
            });
    }

    componentDidMount = () => {
        this.refreshState();
    }

    render() {
        if (this.ready) {
            this.refreshState();
        }
        return (
            <>
                <div className="conversation-name">
                    <p>{this.state.chatName}</p>
                </div>
                <div className="message-list">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.state.messages}
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<Avatar src={this.state.users[item.sender_id].profile_pic} />}
                                    title={<Title name={this.state.users[item.sender_id].name} date={item.date} />}
                                    description={item.message}
                                />
                            </List.Item>
                        )}
                    />
                </div>
                <div className="input-text">
                    <Input placeholder="Message" />
                </div>
            </>
        )
    }
}
