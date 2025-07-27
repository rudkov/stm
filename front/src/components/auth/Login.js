import { useLocation } from 'react-router';

import { Form, Input, Button } from 'antd';
import { useLoginMutation } from '../../api/accountApi';

import AuthLayout from './AuthLayout';
import BaseForm from './BaseForm';

const Login = () => {
    const location = useLocation();
    const [login, result] = useLoginMutation();

    const to = location.state?.from?.pathname + location.state?.from?.search
        || new URLSearchParams(location.search).get('from')
        || '/app';

    const handleSubmit = ({ email, password }) => {
        login({ email, password });
    };

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Sign In</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <BaseForm
                    name='login'
                    layout='vertical'
                    size='large'
                    className='auth-form'
                    result={result}
                    onFinish={handleSubmit}
                    navigateOnSuccess={[to, { replace: true }]}
                >
                    <Form.Item
                        name='email'
                        label='Email'
                        rules={[
                            { required: true, message: 'Please enter your email address' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}

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
                        <a href='/forgot-password'>Forgot password?</a>
                    </div>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' loading={result.isLoading} block>Sign In</Button>
                    </Form.Item>
                </BaseForm>
            </AuthLayout.Body>
            <AuthLayout.Footer>
                Don't have an account? <a href='/register'>Sign up</a>
            </AuthLayout.Footer>
        </AuthLayout>
    );
};

export default Login;