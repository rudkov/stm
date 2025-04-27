import axios from 'axios';
import { useNavigate, useLocation } from 'react-router';

import { Row, Col } from 'antd';
import { Form, Input, Button } from 'antd';

import { useDispatch } from 'react-redux';
import { authActions } from "../../store/auth";

const Login = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/app/calendar';

    const handleSubmit = (values) => {
        axios({
            method: 'post',
            url: '/api/v1/login',
            data: {
                email: values.email,
                password: values.password,
            },
        })
            .then(function (response) {
                if (response.data !== false) {
                    let data = response.data;
                    dispatch(authActions.login({ data }));
                    navigate(from, { replace: true });
                } else {
                    // TODO: handle auth error
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
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
                        onFinish={handleSubmit}
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
                </Col>
            </Row>
        </>
    );
}

export default Login;