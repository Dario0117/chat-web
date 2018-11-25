import React, { Component } from 'react';
import { Menu, Dropdown, Icon, Modal } from 'antd';
import './Conversation.css';


class Conversation extends Component {
    state = {
        NewCmodalVisible: false,
        SearchCmodalVisible: false,
        conversations: [
            'Name 1',
            'Name 2',
            'Name 3',
            'Name 4',
            'Name 5',
            'Name 6',
            'Name 7',
            'Name 8',
            'Name 9',
            'Name 10',
        ]
    }

    setNewCVisible = (NewCmodalVisible) => {
        this.setState({ NewCmodalVisible });
    }
    setSearchCVisible = (SearchCmodalVisible) => {
        this.setState({ SearchCmodalVisible });
    }

    handleMenuClick = (e) => {
        if (e.key === '0') {
            this.setState({ NewCmodalVisible: true });
        } else if (e.key === '1') {
            this.setState({ SearchCmodalVisible: true });
        }
    }

    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="0">Create a new conversation</Menu.Item>
                <Menu.Item key="1">Search conversation</Menu.Item>
            </Menu>
        );
        return (
            <div className="conversation-box">
                <Dropdown overlay={menu} trigger={['click']}>
                    <a className="ant-dropdown-link conversation-dropdown" href="/">
                        CONVERSATIONS <Icon type="down" />
                    </a>
                </Dropdown>
                <ul>
                    {this.state.conversations.map((el) => {
                        return (<li key={el}># {el}</li>)
                    })}
                </ul>

                <Modal
                    title="Create a new conversation"
                    centered
                    visible={this.state.NewCmodalVisible}
                    onOk={() => this.setNewCVisible(false)}
                    onCancel={() => this.setNewCVisible(false)}
                >
                    <p>some contents...</p>
                    <p>some contents...</p>
                    <p>some contents...</p>
                </Modal>

                <Modal
                    title="Search conversation"
                    centered
                    visible={this.state.SearchCmodalVisible}
                    onOk={() => this.setSearchCVisible(false)}
                    onCancel={() => this.setSearchCVisible(false)}
                >
                    <p>some contents...</p>
                    <p>some contents...</p>
                    <p>some contents...</p>
                </Modal>
            </div>
        )
    }
}

export default Conversation;