import { useNavigate, useLocation } from 'react-router';

import { Form, Input, Button } from 'antd';
import { useLoginMutation, useCheckAuthQuery } from '../../api/authApi';
import { useEffect } from 'react';

import AuthLayout from './AuthLayout';

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [login, { isLoading, error }] = useLoginMutation();
    const { data: authData } = useCheckAuthQuery();
    const [form] = Form.useForm();

    const to = location.state?.from?.pathname + location.state?.from?.search
        || new URLSearchParams(location.search).get('from')
        || '/app';

    useEffect(() => {
        if (authData?.isAuthenticated) {
            navigate(to, { replace: true }); 
        }
    }, [authData?.isAuthenticated, navigate, to]);
    
    useEffect(()=> {
        if (error?.isValidationError) {
            form.setFields(error.fieldErrors);
        } else if (error) {
            // TODO: Handle general error
            console.log('Login failed. Please try again.');
        }
    }, [form, error]);

    const handleSubmit = async (values) => {
        await login({
            email: values.email,
            password: values.password,
        });
    };

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Sign In</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <Form
                    name='login'
                    form={form}
                    layout='vertical'
                    requiredMark={false}
                    size='large'
                    className='auth-form'
                    validateTrigger='onBlur'
                    onFinish={handleSubmit}
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
                        <Button type='primary' htmlType='submit' loading={isLoading} block>Sign In</Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
            <AuthLayout.Footer>
                Don't have an account? <a href='/register'>Sign up</a>
            </AuthLayout.Footer>
        </AuthLayout>
    );
};

export default Login;