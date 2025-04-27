import axios from 'axios';
import { useNavigate } from 'react-router';

import { Row, Col } from 'antd';
import { Form, Input, Button } from 'antd';

import { useDispatch } from 'react-redux';
import { authActions } from "../../store/auth";

const Register = () => {
    const dispatch = useDispatch();

    const navigate = useNavigate();
    const from = '/app';

    const handleSubmit = (values) => {
        axios({
            method: 'post',
            url: '/api/v1/register',
            data: {
                email: values.email,
            },
        })
            .then(function (response) {
                console.log(response);
                if (response.data === true) {
                    let data = response.data;
                    dispatch(authActions.login({ data }));
                    navigate(from, { replace: true });
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

export default Register;