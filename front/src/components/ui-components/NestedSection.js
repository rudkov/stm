import './NestedSection.css';

const NestedSection = ({ children, className = '', ...props }) => {
    return (
        <div className={`nested-section ${className}`} {...props}>
            {children}
        </div>
    );
}

const Header = ({ children, className = '', ...props }) => {
    return (
        <div className={`nested-section__header ${className}`} {...props}>
            {children}
        </div>
    );
};

const Body = ({ children, className = '', ...props }) => {
    return (
        <div className={`nested-section__body ${className}`} {...props}>
            {children}
        </div>
    );
};

NestedSection.Header = Header;
NestedSection.Body = Body;

export default NestedSection;
