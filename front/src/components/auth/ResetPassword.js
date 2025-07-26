import { Button, Form, Input, message } from 'antd';
import AuthLayout from './AuthLayout';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { useResetPasswordMutation } from '../../api/accountApi';
import { useEffect } from 'react';


function ResetPassword() {
    const [form] = Form.useForm();
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const { token } = useParams();
    const navigate = useNavigate();
    const [resetPassword, { isLoading, error }] = useResetPasswordMutation();

    const onFinish = ({ password }) => {
        resetPassword({ token, email, password }).unwrap().then((response) => {
            message.success(response.message || 'Your password has been reset!');
            navigate('/login', { replace: true });
        }).catch(() => {});
    };

    useEffect(()=> {
        if (error?.isValidationError) {
            form.setFields(error.fieldErrors);
        } else if (error) {
            message.error('Failed to reset password. Please try again.');
        }
    }, [form, error]);

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Reset Your Password</h3>
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
                        name='password'
                        rules={[
                            { required: true, message: 'Please enter a password' },
                            { min: 8, message: 'Password must be at least 8 characters' }
                        ]}
                    >
                        <Input.Password placeholder='New password' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block loading={isLoading}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ResetPassword; 