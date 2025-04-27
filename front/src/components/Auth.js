import axios from 'axios';

import { authActions } from '../store/auth';
import { useDispatch } from 'react-redux';

import { Row, Col } from 'antd';
import { Form, Input, Button } from 'antd';

function Auth() {

    const dispatch = useDispatch();

    const onFinish = (values) => {
        axios({
            method: 'post',
            url: '/api/v1/login',
            data: {
                email: values.email,
                password: values.password,
            },
        })
            .then(function (response) {
                //success
                if(response.data === true) {
                    dispatch(authActions.login());
                } else {
                    // TODO: handle auth error
                }
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const testLogged = () => {
        console.log('testLogged');
        axios({
            method: 'get',
            url: '/api/v1/testLogged',
        })
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    const testNotLogged = () => {
        console.log('testNotLogged');
        axios({
            method: 'get',
            url: '/api/v1/testNotLogged',
        })
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

    const logout = () => {
        console.log('logout');
        axios({
            method: 'post',
            url: '/api/v1/logout',
        })
            .then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    };

  return (
    <>
    <Row>
      <Col span={8} offset={8}>
        <Form
        name="basic"
        labelCol={{
            span: 8,
        }}
        wrapperCol={{
            span: 16,
        }}
        initialValues={{
            remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="Email"
                name="email"
                rules={[
                {
                    required: true,
                    message: 'Please input your email',
                },
                ]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[
                {
                    required: true,
                    message: 'Please input your password',
                },
                ]}
            >
                <Input.Password />
            </Form.Item>

            <Form.Item
                wrapperCol={{
                offset: 8,
                span: 16,
                }}
            >
                <Button type="primary" htmlType="submit">
                Submit
                </Button>
            </Form.Item>
        </Form>
        <Button onClick={testLogged}>testLogged</Button>
        <Button onClick={testNotLogged}>testNotLogged</Button>
        <Button onClick={logout}>logout</Button>
      </Col>
    </Row>
    </>
  );
}

export default Auth;