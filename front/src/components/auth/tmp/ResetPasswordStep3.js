// import './ResetPasswordStep3.css';

import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';

function ResetPasswordStep3() {
    const [form] = Form.useForm();

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Reset Your Password</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <Form
                    name='reset-password-step-3'
                    form={form}
                    layout='vertical'
                    requiredMark={false}
                    size='large'
                    className='auth-form'
                >
                    <Form.Item
                        name='password'
                        rules={[{ required: true, message: 'Please enter a password' }]}
                    >
                        <Input.Password placeholder='New password' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>Reset Password</Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ResetPasswordStep3;
