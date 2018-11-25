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
            selectedUsers: [],
            children: [],
            convName: "",
            NewCmodalVisible: false,
            SearchCmodalVisible: false,
            results: ['asd', 'asd2'],
            conversations: [],
            users: [],
        }
    }

    componentDidMount = () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('token'),
            }
        };
        fetch('http://192.168.99.100:8080/users', options)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    users: res,
                    children: res.map((user) => <Option key={user.name}>{user.name}</Option>)
                });
            })
            .catch(console.log);

        fetch('http://192.168.99.100:8080/rooms', options)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    conversations: res,
                });
            })
            .catch(console.log);
    }


    NewCOk = () => {
        console.log("Creating conv...");
        this.setState({
            NewCmodalVisible: false,
            selectedUsers: [],
            convName: "",
        });
        // window.location.reload(true);
    }

    NewCCancel = () => {
        this.setState({
            NewCmodalVisible: false,
            selectedUsers: [],
            convName: "",
        });
        // window.location.reload(true);
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
        this.setState({
            selectedUsers: value,
        });
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
                        return (<li key={el.id}># {el.name}</li>)
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
                        defaultValue={this.state.selectedUsers}
                        onChange={this.handleChange}
                    >
                        {this.state.children}
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