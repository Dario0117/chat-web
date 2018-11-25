import React, { Component } from 'react';
import {
    Menu, Dropdown, Icon,
    Modal, Select, Input, List
} from 'antd';
import './Conversation.css';
import HOST from '../settings';

const Option = Select.Option;
const Search = Input.Search;

class Conversation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedUsers: [],
            children: [],
            convName: "",
            convMsg: "",
            NewCmodalVisible: false,
            SearchCmodalVisible: false,
            results: [],
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
        fetch(`${HOST}/users`, options)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    users: res,
                    children: res.map((user) => <Option key={`${user.name}_${user.id}`}>{user.name}</Option>)
                });
            })
            .catch(console.log);

        fetch(`${HOST}/rooms`, options)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    conversations: res,
                });
            })
            .catch(console.log);
    }


    NewCOk = async () => {
        let body = {
            message: this.state.convMsg,
            receivers: this.state.selectedUsers.map((su) => {
                return +su.split('_')[1];
            }),
        }
        if (this.state.selectedUsers.length > 1){
            body.name = this.state.convName;
        }
        let options = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('token'),
            }
        };
        await fetch(`${HOST}/rooms`, options)
            .then((res) => res.json())
            .then(() => {
                this.setState({
                    NewCmodalVisible: false,
                    selectedUsers: [],
                    convName: "",
                });
            })
            .catch(console.log);

        const options2 = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('token'),
            }
        };

        await fetch(`${HOST}/rooms`, options2)
            .then((res) => res.json())
            .then((res) => {
                this.setState({
                    conversations: res,
                });
            })
            .catch(console.log);

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
        this.setState({
            convName: e.target.value,
        });
    }

    ConvMsgChange = (e) => {
        this.setState({
            convMsg: e.target.value,
        });
    }

    searchConv = (value) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + localStorage.getItem('token'),
            }
        };
        Promise.all([
            fetch(`${HOST}/rooms?q=${value}`, options).then((res) => res.json()),
            fetch(`${HOST}/users?q=${value}`, options).then((res) => res.json()),
        ]).then((responses) => {
            let res = responses[0].map((el) => `${el.name}_${el.id}`)
            res = res.concat(responses[1].map((el) => `${el.name}_${el.id}`));
            this.setState({
                results: res,
            });
        })
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
                    <p></p>
                    <span>Insert the first message for this conversation:</span>
                    <Input onChange={this.ConvMsgChange} placeholder="Message" />
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
                        renderItem={item => (<List.Item onClick={() => console.log("les ge",item.split('_').pop())}>{item.split('_')[0]}</List.Item>)}
                    />
                </Modal>
            </div>
        )
    }
}

export default Conversation;