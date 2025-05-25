import './Register.css';

import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';

function Register() {
    const [form] = Form.useForm();

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Create an Account</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <Form
                    name='register'
                    form={form}
                    layout='vertical'
                    requiredMark={false}
                    size='large'
                    className='auth-form'
                >
                    <Form.Item
                        name='name'
                        label='Name'
                        rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                        <Input placeholder='Name' />
                    </Form.Item>
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
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>Create Account</Button>
                    </Form.Item>
                    <div className='register-form__terms'>
                        By clicking 'Create Account', you agree to our&nbsp;
                        <a href='#'>Terms of Service</a> and&nbsp;
                        <a href='#'>Privacy Policy</a>.
                    </div>
                </Form>
            </AuthLayout.Body>
            <AuthLayout.Footer>
                Already have an account? <a href='#'>Sign in</a>
            </AuthLayout.Footer>
        </AuthLayout>
    );
}

export default Register;
