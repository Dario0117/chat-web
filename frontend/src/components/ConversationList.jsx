import React, { Component } from 'react';
import {
    Menu, Dropdown, Icon, message,
    Modal, Select, Input, List
} from 'antd';
import './ConversationList.css';
import {
    listUsers, listRooms,
    createRoom, searchConversation
} from '../utils/RequestManager';

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
            selectedConvFromSearch: "",
            searchValue: "",
            conversationNameDisabled: true,
        }
    }

    componentDidMount = () => {
        listUsers()
            .then((res) => {
                this.setState({
                    users: res,
                    children: res.map((user) => <Option key={`${user.name}_${user.id}`}>{user.name}</Option>)
                });
            }).catch(console.log)

        listRooms()
            .then((res) => {
                this.setState({
                    conversations: res,
                });
            }).catch(console.log);
    }


    NewCOk = async () => {
        if (this.state.selectedUsers.length === 0 || this.state.convMsg === "") {
            message.error('You must provide at least one user and the first message of the conversation.');
            return;
        }
        let body = {
            message: this.state.convMsg,
            receivers: this.state.selectedUsers.map((su) => {
                return +su.split('_')[1];
            }),
        }
        if (this.state.selectedUsers.length > 1) {
            body.name = this.state.convName;
        } else {
            let searchedConversation = this.state.conversations.find((user) => 
                (user.name === this.state.selectedUsers[0].split('_')[0])
            );

            if (searchedConversation) {
                this.props.changeSelectedRoom(searchedConversation.id);
                this.setState({
                    NewCmodalVisible: false,
                    selectedUsers: [],
                    convName: "",
                    convMsg: "",
                    conversationNameDisabled: true,
                });
                return;
            }
        }

        await createRoom(body)
            .then(() => {
                this.setState({
                    NewCmodalVisible: false,
                    selectedUsers: [],
                    convName: "",
                    convMsg: "",
                    conversationNameDisabled: true,
                });
            }).catch(console.log);


        await listRooms()
            .then((res) => {
                this.setState({
                    conversations: res,
                });
            }).catch(console.log);

        // window.location.reload(true);
    }

    NewCCancel = () => {
        this.setState({
            NewCmodalVisible: false,
            selectedUsers: [],
            convName: "",
            convMsg: "",
        });
        // window.location.reload(true);
    }

    setSearchCVisible = (SearchCmodalVisible, cancel = false) => {
        if (!cancel) {
            this.props.changeSelectedRoom(this.state.selectedConvFromSearch.split('_').pop());
        }
        this.setState({
            SearchCmodalVisible,
            selectedConvFromSearch: '',
            searchValue: '',
            results: [],
        });
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
            conversationNameDisabled: (value.length < 2),
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
        if (!value) return;
        searchConversation(value)
            .then((responses) => {
                let res = responses[0].map((el) => `${el.name}_${el.id}`)
                res = res.concat(responses[1].map((el) => `${el.name}_${el.id}`));
                this.setState({
                    results: res,
                });
            });
    }

    changeSearchButton = (e) => {
        this.setState({
            searchValue: e.target.value,
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
                        return (<li onClick={() => {
                            this.props.changeSelectedRoom(el.id);
                        }} key={el.id}># {el.name}</li>)
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
                        value={this.state.selectedUsers}
                        onChange={this.handleChange}
                    >
                        {this.state.children}
                    </Select>
                    <p></p>
                    <span>Insert the name of the conversation:</span>
                    <Input onChange={this.ConvNameChange} placeholder="Conversation name" value={this.state.convName} disabled={this.state.conversationNameDisabled} />
                    <p></p>
                    <span>Insert the first message for this conversation:</span>
                    <Input onChange={this.ConvMsgChange} placeholder="Message" value={this.state.convMsg} />
                </Modal>

                <Modal
                    title="Search conversation"
                    centered
                    visible={this.state.SearchCmodalVisible}
                    onOk={() => this.setSearchCVisible(false)}
                    onCancel={() => this.setSearchCVisible(false, true)}
                >
                    <Search
                        placeholder="Type the conversation name..."
                        value={this.state.searchValue}
                        onChange={this.changeSearchButton}
                        onSearch={this.searchConv}
                        style={{ width: '100%' }}
                    />
                    <p></p>
                    <p>
                        Selected conversation: <strong>{this.state.selectedConvFromSearch.split('_')[0]}</strong>
                    </p>
                    <p></p>
                    <List
                        bordered
                        dataSource={this.state.results}
                        renderItem={item => (<List.Item onClick={(e) => {
                            // console.log(e.target.parentElement);
                            // e.target.parentElement.style.backgroundColor = '#4D394B';
                            this.setState({
                                selectedConvFromSearch: item,
                            })
                        }}>{item.split('_')[0]}</List.Item>)}
                    />
                </Modal>
            </div>
        )
    }
}

export default Conversation;