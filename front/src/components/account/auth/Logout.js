import { useNavigate } from 'react-router';
import { useLogoutMutation } from 'api/accountApi';
import { useNotification } from 'components/notifications/NotificationProvider';
import { useEffect } from 'react';

const Logout = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();
    const showNotification = useNotification();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout().unwrap();
                navigate('/', { replace: true });
            } catch (error) {
                navigate(-1, { replace: true });
                showNotification({ type: 'ERROR', message: 'Something went wrong. Please try again.' });
            }
        };

        performLogout();
    }, [logout, navigate, showNotification]);

    return null;
};

export default Logout;