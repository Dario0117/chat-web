import React, { Component } from 'react';
import './Chat.css';
import Profile from './Profile';
import ConversationList from './ConversationList';

import { Input, List, Avatar } from 'antd';

export default class Chat extends Component {
    state = {
        name: "Chatting with the boi",
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
    render() {
        return (
            <div>
                <div className="split left">
                    <Profile name={localStorage.getItem('name')} src={"https://mobirise.com/bootstrap-template/profile-template/assets/images/timothy-paul-smith-256424-1200x800.jpg"}/>
                    <ConversationList />
                </div>

                <div className="split right">
                    <div className="conversation-name">
                        <p>{this.state.name}</p>
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
                        <Input placeholder="Message"/>
                    </div>
                </div>
            </div>
        )
    }
}
