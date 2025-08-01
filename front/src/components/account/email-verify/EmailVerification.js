import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router';
import { Spin, Result, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { useVerifyEmailMutation } from 'api/accountApi'; // adjust path if needed
import { useCheckAuthQuery } from 'api/accountApi';

import AuthLayout from 'components/account/AuthLayout';
import './EmailVerification.css';

const EmailVerification = () => {
    const { id, hash } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { data: authData } = useCheckAuthQuery();

    const [verificationStatus, setVerificationStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [errorMessage, setErrorMessage] = useState('');

    const [verifyEmail] = useVerifyEmailMutation();

    useEffect(() => {
        const expires = searchParams.get('expires');
        const signature = searchParams.get('signature');

        if (authData?.hasVerifiedEmail) {
            setVerificationStatus('success');
            return;
        }

        if (!id || !hash || !expires || !signature) {
            setVerificationStatus('error');
            setErrorMessage('Invalid verification link. Please check your email and try again.');
            return;
        }

        verifyEmail({ id, hash, expires, signature })
            .unwrap()
            .then(() => setVerificationStatus('success'))
            .catch((err) => {
                setVerificationStatus('error');
                setErrorMessage(
                    err?.data?.message || 'Verification failed. Please try again.'
                );
            });
    }, [id, hash, searchParams, authData, verifyEmail]);

    const handleContinue = () => {
        navigate('/app', { replace: true })
    };

    const handleResendEmail = () => {
        navigate('/email-verify/resend/', {
            state: { autoSubmit: true },
        });
    };

    return (
        <AuthLayout>
            <AuthLayout.Header>
                <h1 className="text-h1 text-primary">Email Verification</h1>
            </AuthLayout.Header>

            <AuthLayout.Body>
                {verificationStatus === 'verifying' && (
                    <Result
                        icon={<LoadingOutlined style={{ color: '#1890ff' }} />}
                        title="Verifying your email..."
                        subTitle="Please wait while we verify your email address."
                        extra={<Spin size="large" />}
                    />
                )}

                {verificationStatus === 'success' && (
                    <Result
                        status="success"
                        icon={<CheckCircleOutlined />}
                        title="Email Verified Successfully!"
                        subTitle="Your email address has been verified. You can now get started."
                        extra={[
                            <Button type="primary" key="continue" onClick={handleContinue}>
                                Continue
                            </Button>
                        ]}
                    />
                )}

                {verificationStatus === 'error' && (
                    <Result
                        status="error"
                        icon={<CloseCircleOutlined />}
                        title="Verification Failed"
                        subTitle={errorMessage}
                        extra={[
                            <Button type="primary" key="resend" onClick={handleResendEmail}>
                                Resend Verification Email
                            </Button>
                        ]}
                    />
                )}
            </AuthLayout.Body>
        </AuthLayout>
    );
};

export default EmailVerification; 