import './Auth.css';
import '../../helpers/shared.css';

import { Outlet } from 'react-router';

function Auth() {
    return (
        <div className='auth-page'>
            <div className='auth-page__content'>
                <Outlet />
            </div>
        </div>
    );
}

export default Auth;
