import React, { Component } from 'react';
import {
    Menu, Dropdown, Icon,
    Modal, Select, Input, List
} from 'antd';
import './Conversation.css';

const Option = Select.Option;
const Search = Input.Search;

class Conversation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            NewCmodalVisible: false,
            SearchCmodalVisible: false,
            results:  ['asd', 'asd2'],
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
            ],
            users: [
                {
                    id: 5,
                    name: 'Name 1'
                },
                {
                    id: 312,
                    name: 'Name 2'
                },
                {
                    id: 3534,
                    name: 'Name 3'
                },
                {
                    id: 646,
                    name: 'Name 4'
                },
                {
                    id: 2342,
                    name: 'Name 5'
                },
                {
                    id: 75657,
                    name: 'Name 6'
                },
                {
                    id: 7878,
                    name: 'Name 7'
                },
            ],
        }
        this.children = [];
        for (let user of this.state.users) {
            this.children.push(<Option key={user.name}>{user.name}</Option>);
        }

        // Create new conversation fields
        this.selectedUsers = [];
        this.convName = "";

    }

    NewCOk = () => {
        console.log("Creating conv...");
        this.selectedUsers = [];
        this.convName = "";
        this.setState({ NewCmodalVisible: false });
        window.location.reload(true);
    }

    NewCCancel = () => {
        this.selectedUsers = [];
        this.convName = "";
        this.setState({ NewCmodalVisible: false });
        window.location.reload(true);
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

    handleChange = (value) => {
        this.selectedUsers = value;
        // console.log(this.selectedUsers);
    }

    ConvNameChange = (e) => {
        this.convName = e.target.value;
    }

    searchConv = (value) => {
        console.log(value)
        this.setState({ 
            results: this.state.results.concat(value) 
        });
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
                    onOk={() => this.NewCOk()}
                    onCancel={() => this.NewCCancel()}
                >
                    <span>Select all the users you want in this conversation:</span> <br />
                    <span>* NOTE: If you select only one, it means that you are creating a private message.</span>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Please select users"
                        allowClear={true}
                        defaultValue={[]}
                        onChange={this.handleChange}
                    >
                        {this.children}
                    </Select>
                    <p></p>
                    <span>Insert the name of the conversation:</span>
                    <Input onChange={this.ConvNameChange} placeholder="Conversation name" />
                </Modal>

                <Modal
                    title="Search conversation"
                    centered
                    visible={this.state.SearchCmodalVisible}
                    onOk={() => this.setSearchCVisible(false)}
                    onCancel={() => this.setSearchCVisible(false)}
                >
                    <Search
                        placeholder=""
                        onSearch={this.searchConv}
                        style={{ width: '100%' }}
                    />
                    <p></p>
                    <List
                        bordered
                        dataSource={this.state.results}
                        renderItem={item => (<List.Item onClick={() => console.log("les ge")}>{item}</List.Item>)}
                    />
                </Modal>
            </div>
        )
    }
}

export default Conversation;