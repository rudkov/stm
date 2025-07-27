import './ForgotPasswordSuccess.css';

import AuthLayout from 'components/auth/AuthLayout';

function ForgotPasswordSuccess() {
    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h3 className='auth-page__title'>Reset Your Password</h3>
            </AuthLayout.Header>
            <AuthLayout.Body>
                <p className='reset-password-step-2__paragraph'>You’ll receive a password reset email if you have an account. You may close this page now.</p>
            </AuthLayout.Body>
        </AuthLayout>
    );
}

export default ForgotPasswordSuccess;