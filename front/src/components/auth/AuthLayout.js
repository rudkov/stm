import './AuthLayout.css';
import '../../helpers/shared.css';

const AuthLayout = ({ children, className = '', ...props }) => {
    return (
        <div className={`auth-page ${className}`} {...props}>
            <div className='auth-page__content'>
                <div className='auth-page__container'>
                    {children}
                </div>
            </div>
        </div>
    );
}

const Header = ({ children, className = '', ...props }) => {
    return (
        <div className={`auth-page__header ${className}`} {...props}>
            {children}
        </div>
    );
};

const Body = ({ children, className = '', ...props }) => {
    return (
        <div className={`auth-page__body section-primary ${className}`} {...props}>
            {children}
        </div>
    );
};

const Footer = ({ children, className = '', ...props }) => {
    return (
        <div className={`auth-page__footer ${className}`} {...props}>
            {children}
        </div>
    );
};

AuthLayout.Header = Header;
AuthLayout.Body = Body;
AuthLayout.Footer = Footer;

export default AuthLayout;
