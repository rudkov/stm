import { Button, Popconfirm } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ReactComponent as IconClose } from '../../../../assets/icons/close.svg';

/**
 * Reusable form header component with title and controls
 */
function FormHeader({
    title,
    isLoading,
    enableDelete,
    entity,
    onSubmit,
    onDelete,
    onClose,
    headerTitleClass,
    headerControlsClass,
    headerThrobberClass,
    getDeleteConfirmationText = () => 'Delete item?',
    bypassDeleteConfirm = false,
}) {
    return (
        <>
            <div className={headerTitleClass}>
                {title}
            </div>
            <div className={headerControlsClass}>
                <LoadingOutlined className={`${headerThrobberClass} ${isLoading ? '' : 'hidden'}`} />
                {enableDelete && (
                    bypassDeleteConfirm ? (
                        <Button danger onClick={onDelete}>Delete</Button>
                    ) : (
                        <Popconfirm
                            title={getDeleteConfirmationText(entity)}
                            onConfirm={onDelete}
                            okText='Delete'
                            cancelText='Cancel'
                        >
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    )
                )}
                <Button type='primary' onClick={onSubmit}>Save</Button>
                <Button
                    type='text'
                    icon={<IconClose />}
                    onClick={onClose}
                    className='custom-drawer__close-button'
                />
            </div>
        </>
    );
}

export default FormHeader; 
