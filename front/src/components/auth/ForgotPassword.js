import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';
import { useForgotPasswordMutation } from '../../api/accountApi'; 
import { useNavigate } from 'react-router';
import { useEffect } from 'react';


function ForgotPassword() {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [forgotPassword, { isLoading, isSuccess, error }] = useForgotPasswordMutation();

    const onFinish = async (values) => {
        await forgotPassword(values.email);
    };

    useEffect(()=> {
        if (isSuccess) {
            navigate('/forgot-password/success', { replace: true }); 
        }
    }, [isSuccess, navigate]);

    useEffect(()=> {
        if (error?.isValidationError) {
            form.setFields(error.fieldErrors);
        } else if (error) {
            // TODO: Handle general error
            console.log('Reset password failed. Please try again.');
        }
    }, [form, error]);
    
    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Reset Your Password</h3>
                <p className='auth-page__paragraph'>Enter your email address below and we'll send you a link to reset your password.</p>
            </AuthLayout.Header>
            <AuthLayout.Body>                    
                    <Form
                        name='reset-password'
                        form={form}
                        layout='vertical'
                        requiredMark={false}
                        size='large'
                        className='auth-form'
                        validateTrigger='onBlur'
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name='email'
                            rules={[
                                { type: 'email', message: 'Please enter a valid email' },
                                { required: true, message: 'Please enter your email address' },
                            ]}
                        >
                            <Input placeholder='Email' />
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType='submit' block loading={isLoading}>
                                Send Reset Instructions
                            </Button>
                        </Form.Item>                        
                    </Form>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ForgotPassword;
