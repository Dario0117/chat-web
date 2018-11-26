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
            users: [], // List of all users on the app
            children: [], // This is a list of the name and id (in the format name_id) of the users, this list is showed in the dropdown
            conversations: [], // The list of the conversations (private and groups) of the current session
            selectedUsers: [], // This list contains the list of the selected users in the dropdown in the modal of create a new conversation

            convName: "", // Field of modal Create new conversation
            convMsg: "", // Field of modal Create new conversation
            conversationNameDisabled: true, // Field of modal Create new conversation
            NewCmodalVisible: false, // Field of modal Create new conversation

            SearchCmodalVisible: false, // Field of modal search conversation
            results: [], // Field of modal search conversation
            selectedConvFromSearch: "", // Field of modal search conversation
            searchValue: "", // Field of modal search conversation
        }
    }

    updateUsers = () => {
        listUsers()
            .then((users) => {
                this.setState({
                    users,
                })
            });
    }

    componentDidMount = () => {
        Promise.all([
            listUsers(),
            listRooms(),
        ])
            .then((responses) => {
                this.setState({
                    users: responses[0],
                    children: responses[0].map((user) => <Option key={`${user.name}_${user.id}`}>{user.name}</Option>),
                    conversations: responses[1],
                });
            });
    }

    NewCOk = async () => {
        if (this.state.selectedUsers.length === 0 || this.state.convMsg === "") {
            message.error('You must provide at least one user and the first message of the conversation.');
            return;
        }
        let body = {
            message: this.state.convMsg,
            // for the list of the receiver users i only need his id's
            // each selected user have the structure 'user_id', i
            // extract this id with split
            receivers: this.state.selectedUsers.map((su) => {
                return +su.split('_')[1];
            }),
        }
        /**
         * if the selected users have two or more (without the current user), 
         * is considerated as a group and a group needs a name
         */
        if (this.state.selectedUsers.length > 1) {
            body.name = this.state.convName;
        } else {
            /**
             * if is only one, it means that is a private conversation, and i check if exists
             * a conversation with this user and just open this conversation instead of
             * create a new one
             */
            let searchedConversation = this.state.conversations.find((user) =>
                (user.name === this.state.selectedUsers[0].split('_')[0])
            );

            if (searchedConversation) {
                this.props.changeSelectedRoom(searchedConversation.id);
                this.resetCreateConversation({
                    conversationNameDisabled: true,
                });
                return;
            }
        }

        let room = await createRoom(body);
        this.props.changeSelectedRoom(room.id);
        let rooms = await listRooms();

        this.resetCreateConversation({
            conversationNameDisabled: true,
            conversations: rooms,
        });
    }

    NewCCancel = () => {
        this.resetCreateConversation();
    }

    resetCreateConversation = (another = {}) => {
        let modalState = {
            NewCmodalVisible: false,
            selectedUsers: [],
            convName: "",
            convMsg: "",
        };
        this.setState({
            ...modalState,
            ...another,
        });
    }

    setSearchCVisible = (SearchCmodalVisible, cancel = false) => {
        // If the user hit 'cancel', it only reset the fields
        // else, get the selected conversation and show it
        if (!cancel) {
            if (!this.state.selectedConvFromSearch) {
                message.error('You must select a conversation.');
                return;
            } else {
                this.props.changeSelectedRoom(this.state.selectedConvFromSearch.split('_').pop());
            }
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
        // This method search in conversation and user names
        // and then, you can select if want to open a conversation with a user
        // or with a group
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
                        style={{ width: '95%' }}
                        placeholder="Please select users"
                        allowClear={true}
                        defaultValue={this.state.selectedUsers}
                        value={this.state.selectedUsers}
                        onChange={this.handleChange}
                    >
                        {this.state.children}
                    </Select>
                    <Icon
                        type="sync"
                        onClick={this.updateUsers}
                        style={{ 
                            fontSize: '18px', 
                            paddingLeft: '5px', 
                            cursor: 'pointer' 
                        }}
                    />
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