import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import './Login.css';

const FormItem = Form.Item;

class NormalLoginForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.login(values.userName, values.passwordLogin);
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <>
                <center><h1>Login</h1></center>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input className="input-custom" placeholder="Username" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('passwordLogin', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input className="input-custom" type="password" placeholder="Password" />
                        )}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit" className="login-form-button btn-custom" >
                            Log in
                        </Button>
                    </FormItem>
                </Form>
            </>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default WrappedNormalLoginForm;