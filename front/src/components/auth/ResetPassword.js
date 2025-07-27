import { Button, Form, Input } from 'antd';
import AuthLayout from './AuthLayout';
import BaseForm from './BaseForm';
import { useParams, useSearchParams } from 'react-router';
import { useResetPasswordMutation } from '../../api/accountApi';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const { token } = useParams();
    const [resetPassword, result] = useResetPasswordMutation();

    const onFinish = ({ password }) => {
        resetPassword({ token, email, password });
    };

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Reset Your Password</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <BaseForm
                    name='reset-password'
                    layout='vertical'
                    size='large'
                    className='auth-form'
                    result={result}
                    navigateOnSuccess={['/login', { replace: true }]}
                    successNotification='Your password has been reset!'
                    onFinish={onFinish}
                >
                    <Form.Item
                        name='email'
                    >
                        <strong>{ email }</strong>
                    </Form.Item>
                    <Form.Item
                        name='password'
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password placeholder='New password' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block loading={result.isLoading}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </BaseForm>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ResetPassword; 