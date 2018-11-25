import React, { Component } from 'react';
import { Input, List, Avatar } from 'antd';
import './MessageList.css';

export default class MessageList extends Component {
    render() {
        return (
            <>
                <div className="conversation-name">
                    <p>{this.props.chatName}</p>
                </div>
                <div className="message-list">
                    <List
                        itemLayout="horizontal"
                        dataSource={this.props.data}
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
            </>
        )
    }
}
