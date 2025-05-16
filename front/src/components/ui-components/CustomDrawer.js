import './CustomDrawer.css';

import { Drawer } from 'antd';

const CustomDrawer = ({ children, className = '', ...props }) => {
    return (
        <Drawer
            open={props.open}
            onClose={props.onClose}
            width={props.width}
            placement='right'
            closable={false}
            title={null}
            footer={null}
            destroyOnClose={true}
            styles={{
                content: {
                    background: 'none',
                    overflow: 'visible',
                },
                wrapper: {
                    boxShadow: 'none',
                    overflow: 'visible',
                },
                body: {
                    padding: 16,
                    overflow: 'visible',
                }
            }}
        >
            <div className={`custom-drawer ${className}`}>
                {children}
            </div>
        </Drawer>
    );
};

export default CustomDrawer;
