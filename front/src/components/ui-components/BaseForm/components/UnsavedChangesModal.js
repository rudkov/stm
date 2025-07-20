import { Button, Modal } from 'antd';

/**
 * Modal to confirm discarding unsaved changes
 */
function UnsavedChangesModal({
    open,
    onSaveChanges,
    onDiscardChanges,
    onCloseModal
}) {
    return (
        <Modal
            title='Save Changes?'
            closable={true}
            open={open}
            zIndex={2000}
            onOk={onSaveChanges}
            onCancel={onCloseModal}
            footer={[
                <Button
                    key='back'
                    onClick={onCloseModal}
                >
                    Cancel
                </Button>,
                <Button
                    key='discard'
                    type='default'
                    onClick={onDiscardChanges}
                >
                    Don't Save
                </Button>,
                <Button
                    key='submit'
                    type='primary'
                    onClick={onSaveChanges}
                >
                    Save
                </Button>
            ]}
        >
            <p>Your changes will be lost if you don't save them.</p>
        </Modal>
    );
}

export default UnsavedChangesModal; 