import './Register.css';
import { Button, Form, Input } from 'antd';
import AuthLayout from 'components/auth/AuthLayout';
import BaseForm from 'components/auth/BaseForm';
import { useRegisterMutation } from 'api/accountApi';


function Register() {
    const [register, result] = useRegisterMutation();

    const handleSubmit = ({name, email, password}) => {
        register({name, email, password});
    };

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Create an Account</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <BaseForm
                    name='register'
                    layout='vertical'
                    size='large'
                    className='auth-form'
                    result={result}
                    onFinish={handleSubmit}
                    navigateOnSuccess={['/create-team', { replace: true }]}
                    successNotification="You're in! Check your email to verify your account."
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
                            loading={result.isLoading}
                        >
                            Create Account
                        </Button>
                    </Form.Item>
                    <div className='register-form__terms'>
                        By clicking 'Create Account', you agree to our&nbsp;
                        <a href='#'>Terms of Service</a> and&nbsp;
                        <a href='#'>Privacy Policy</a>.
                    </div>
                </BaseForm>
            </AuthLayout.Body>
            <AuthLayout.Footer>
                Already have an account? <a href='/login'>Sign in</a>
            </AuthLayout.Footer>
        </AuthLayout>
    );
}

export default Register;
