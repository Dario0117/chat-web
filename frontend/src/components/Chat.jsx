import React, { Component } from 'react';
import './Chat.css';
import Profile from './Profile';
import ConversationList from './ConversationList';
import { Input, List, Avatar } from 'antd';
import { getMyInfo, updateProfilePic } from '../utils/RequestManager';

export default class Chat extends Component {

    constructor(props) {
        super(props)

        this.state = {
            myName: "",
            myPic: "",
            chatName: "chat name temp",
            data: [
                {
                    title: 'Ant Design Title 1',
                },
                {
                    title: 'Ant Design Title 2',
                },
                {
                    title: 'Ant Design Title 3',
                },
                {
                    title: 'Ant Design Title 4',
                },
                {
                    title: 'Ant Design Title 4',
                },
                {
                    title: 'Ant Design Title 4',
                },
                {
                    title: 'Ant Design Title 4',
                },
                {
                    title: 'Ant Design Title 4',
                },
                {
                    title: 'Ant Design Title 4',
                },
                {
                    title: 'Ant Design Title 4',
                },
            ]
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

    render() {
        return (
            <div>
                <div className="split left">
                    <Profile updateProfilePic={this.updatePic} name={this.state.myName} src={this.state.myPic} />
                    <ConversationList />
                </div>

                <div className="split right">
                    <div className="conversation-name">
                        <p>{this.state.chatName}</p>
                    </div>
                    <div className="message-list">
                        <List
                            itemLayout="horizontal"
                            dataSource={this.state.data}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                        title={item.title}
                                        description="Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                    <div className="input-text">
                        <Input placeholder="Message" />
                    </div>
                </div>
            </div>
        )
    }
}
