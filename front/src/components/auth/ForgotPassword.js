import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';
import BaseForm from './BaseForm';
import { useForgotPasswordMutation } from '../../api/accountApi'; 

function ForgotPassword() {
    const [forgotPassword, result] = useForgotPasswordMutation();

    const handleSubmit = ({ email }) => {
        forgotPassword(email);
    };
    
    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Reset Your Password</h3>
                <p className='auth-page__paragraph'>Enter your email address below and we'll send you a link to reset your password.</p>
            </AuthLayout.Header>
            <AuthLayout.Body>                    
                <BaseForm
                    name='reset-password'
                    layout='vertical'
                    size='large'
                    className='auth-form'
                    result={result}
                    navigateOnSuccess={['/forgot-password/success', { replace: true }]}
                    onFinish={handleSubmit}
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
                        <Button type='primary' htmlType='submit' block loading={result.isLoading}>
                            Send Reset Instructions
                        </Button>
                    </Form.Item>                        
                </BaseForm>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ForgotPassword;
