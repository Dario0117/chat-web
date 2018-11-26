import React, { Component } from 'react';
import { List, Avatar } from 'antd';
import './UserList.css';

export default class UserList extends Component {
    render() {
        return (
            <div>
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.users}
                    locale={{ emptyText: "No Users in this conversation..." }}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src={item.profile_pic} />}
                                title={item.name}
                            />
                        </List.Item>
                    )}
                />
            </div>
        )
    }
}
