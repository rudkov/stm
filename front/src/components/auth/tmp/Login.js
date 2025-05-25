import { Form, Input, Button } from 'antd';

import AuthLayout from './AuthLayout';

function Login() {
    const [form] = Form.useForm();

    return (
        <AuthLayout>
            <AuthLayout.Header>
                Sign In
            </AuthLayout.Header>
            <AuthLayout.Body>
                <Form
                    name='login'
                    form={form}
                    layout='vertical'
                    requiredMark={false}
                    size='large'
                    className='auth-form'
                >
                    <Form.Item
                        name='email'
                        label='Email'
                        rules={[{ required: true, message: 'Please enter your email address' }]}
                    >
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[{ required: true, message: 'Please enter a password' }]}
                    >
                        <Input.Password placeholder='Password' />
                    </Form.Item>
                    <div>
                        <a href='#'>Forgot password?</a>
                    </div>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>Sign In</Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
            <AuthLayout.Footer>
                Don't have an account? <a href='#'>Sign up</a>
            </AuthLayout.Footer>
        </AuthLayout>

    );
}

export default Login;
