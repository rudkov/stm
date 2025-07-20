import './Register.css';
import { Button, Form, Input, message } from 'antd';
import AuthLayout from './AuthLayout';
import { useRegisterMutation } from '../../api/registerApi';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';

function Register() {
    const [form] = Form.useForm();
    const [register, { isLoading, error }] = useRegisterMutation();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const response = await register(values).unwrap();
            if (response.success) {
                message.success(response.message || 'Registration successful!');
                navigate('/app/calendar');
            }
        } catch (error) {
            message.error(error.message || 'Registration failed');
        }
    };

    useEffect(() => {
        if (error?.isValidationError) {
            form.setFields(error.fieldErrors);
        } else if (error) {
            // TODO: Handle general error
            console.log('Registration failed. Please try again.');
        }
    }, [form, error]);

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
                    validateTrigger='onBlur'
                    onFinish={onFinish}
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
                        rules={[
                            { required: true, message: 'Please enter your email address' },
                            { type: 'email', message: 'Please enter a valid email address' }
                        ]}
                    >
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item
                        name='password'
                        label='Password'
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password placeholder='Password' />
                    </Form.Item>
                    <Form.Item>
                        <Button 
                            type='primary' 
                            htmlType='submit' 
                            block 
                            loading={isLoading}
                        >
                            Create Account
                        </Button>
                    </Form.Item>
                    <div className='register-form__terms'>
                        By clicking 'Create Account', you agree to our&nbsp;
                        <a href='#'>Terms of Service</a> and&nbsp;
                        <a href='#'>Privacy Policy</a>.
                    </div>
                </Form>
            </AuthLayout.Body>
            <AuthLayout.Footer>
                Already have an account? <a href='/login'>Sign in</a>
            </AuthLayout.Footer>
        </AuthLayout>
    );
}

export default Register;
