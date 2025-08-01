import { useState, useEffect, useRef, useCallback } from 'react';
import { Result, Button } from 'antd';
import { useLocation, useNavigate } from 'react-router';
import { MailOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useResendEmailMutation } from 'api/accountApi';
import { useCheckAuthQuery } from 'api/accountApi';
import { useNotification } from 'components/notifications/NotificationProvider';
import AuthLayout from 'components/account/AuthLayout';


const ResendVerificationEmail = () => {
    const [resendEmail, { isLoading }] = useResendEmailMutation();
    const [status, setStatus] = useState(''); // '' | success | alreadyVerified
    const { data: authData } = useCheckAuthQuery();
    const location = useLocation();
    const navigate = useNavigate();
    const showNotification = useNotification();

    const autoSubmit = location.state?.autoSubmit;

    const hasAutoSubmitted = useRef(false);
    const alreadyVerified = authData?.hasVerifiedEmail;

    const handleResend = useCallback(async () => {
        try {
            const response = await resendEmail().unwrap();
            if (response?.status === 204) {
                setStatus('alreadyVerified');
            } else {
                setStatus('success');
            }
        } catch (error) {
            showNotification({ type: 'ERROR', message: 'Something went wrong. Please try again.' });
        }
    }, [resendEmail, showNotification]);

    useEffect(() => {
        if (autoSubmit && !alreadyVerified && !hasAutoSubmitted.current) {
            hasAutoSubmitted.current = true;
            handleResend();
            // After auto-submitting, update the navigation history to remove the autoSubmit state.
            // This prevents the resend action from triggering again if the user refreshes the page.
            navigate(location.pathname, { replace: true });
        }
    }, [autoSubmit, alreadyVerified, navigate, location.pathname, handleResend]);

    useEffect(() => {
        if (alreadyVerified) {
            setStatus('alreadyVerified');
        }
    }, [alreadyVerified]);


    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h1 className="text-h1 text-primary">Resend Verification Email</h1>
            </AuthLayout.Header>
            <AuthLayout.Body>
                {status === 'success' ? (
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined />}
                        title="Verification Email Sent!"
                        subTitle="Please check your inbox for the verification email."
                    />
                ) : status === 'alreadyVerified' ? (
                    <Result
                        status="info"
                        icon={<CheckCircleOutlined />}
                        title="Email Already Verified"
                        subTitle="Your email address has already been verified."
                    />
                ) : (
                    <Result
                        icon={<MailOutlined />}
                        title="Didn't receive the verification email?"
                        subTitle="Click below to resend."
                        extra={
                            <Button
                                type="primary"
                                onClick={handleResend}
                                loading={isLoading}
                                disabled={isLoading}
                            >
                                Resend Verification Email
                            </Button>
                        }
                    />
                )}
            </AuthLayout.Body>
        </AuthLayout>
    );
};

export default ResendVerificationEmail; 