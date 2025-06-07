import { useNavigate } from 'react-router';
import { useLogoutMutation } from '../../api/authApi';
import { useEffect } from 'react';

const Logout = () => {
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await logout().unwrap();
                navigate('/', { replace: true });
            } catch (error) {
                console.error('Logout failed:', error);
            }
        };

        performLogout();
    }, [logout, navigate]);

    return null;
};

export default Logout;