import { Button, Form, Input } from 'antd';

import AuthLayout from './AuthLayout';

function ResetPassword() {
    const [form] = Form.useForm();

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
                >
                    <Form.Item
                        name='email'
                        rules={[{ required: true, message: 'Please enter your email address' }]}
                    >
                        <Input placeholder='Email' />
                    </Form.Item>
                    <Form.Item>
                        <Button type='primary' htmlType='submit' block>Send Reset Instructions</Button>
                    </Form.Item>
                </Form>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ResetPassword;
