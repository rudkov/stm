import './CustomDrawer.css';

import { Button, Drawer } from 'antd';

import { ReactComponent as IconClose } from '../../assets/icons/close.svg';

//TODO: Try to create .Header and .Body subcomponents

function CustomDrawer({ children, className = '', ...props }) {
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
                <div className='custom-drawer__header'>
                    <div className='custom-drawer__title'>
                        {props.title}
                    </div>
                    <div className='custom-drawer__controls'>
                        {props.onSubmit ? <Button type='primary' onClick={props.onSubmit} loading={props.loading}>Save</Button> : ''}
                        {props.onClose ? <Button type='text' icon={<IconClose />} onClick={props.onClose} /> : ''}
                    </div>
                </div>
                <div className='custom-drawer__body'>
                    {children}
                </div>
            </div>
        </Drawer>
    );
};

export default CustomDrawer;
