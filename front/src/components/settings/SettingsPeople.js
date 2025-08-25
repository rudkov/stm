import './SettingsPeople.css';

import { useCallback, useState } from 'react';
import { Button, Dropdown, Input, Modal, Table } from 'antd';

import { useGetUsersQuery } from 'api/usersApi';
import { useNotification } from 'components/notifications/NotificationProvider';
import { useCopyToClipboard } from 'hooks';

import ScrollableView from 'components/ui-components/ScrollableView';

import { ReactComponent as IconMeatballs } from 'assets/icons/meatballs.svg';

function SettingsPeople() {
    const { data: users = [] } = useGetUsersQuery();
    const invitationLink = 'https://stm.com/invite/hash';
    const showNotification = useNotification();
    const { copyToClipboard } = useCopyToClipboard({ valueToCopy: invitationLink, successMessage: `Link copied to clipboard` });

    const [selectedUser, setSelectedUser] = useState(null);
    const [isRemoveUserModalOpen, setIsRemoveUserModalOpen] = useState(false);
    const [isCopyInvitationLinkModalOpen, setIsCopyInvitationLinkModalOpen] = useState(false);

    const tableColumns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            key: 'action',
            align: 'right',
            render: (_, record) => (
                <Dropdown
                    menu={{
                        items: [
                            { key: 'remove-user', label: 'Remove', onClick: () => openRemoveUserModal(record.id) },
                        ],
                    }}
                    placement='bottomRight'
                    trigger={['click']}
                >
                    <Button
                        type='text'
                        icon={<IconMeatballs />}
                    />
                </Dropdown>
            ),
        },
    ];

    const openCopyInvitationLinkModal = useCallback(() => {
        setIsCopyInvitationLinkModalOpen(true);
    }, []);

    const handleCopyInvitationLinkModalClose = useCallback(() => {
        setIsCopyInvitationLinkModalOpen(false);
    }, []);

    const openRemoveUserModal = useCallback((id) => {
        setSelectedUser(users.find((u) => u.id === id));
        setIsRemoveUserModalOpen(true);
    }, [users]);

    const handleRemoveUserModalCancel = useCallback(() => {
        setSelectedUser(null);
        setIsRemoveUserModalOpen(false);
    }, []);

    const handleRemoveUserModalConfirm = useCallback(() => {
        console.log('Remove user', selectedUser);

        setSelectedUser(null);
        setIsRemoveUserModalOpen(false);
        showNotification({
            type: 'SUCCESS',
            message: `${selectedUser?.name} removed from the team`
        });
    }, [selectedUser, showNotification]);

    return (
        <>
            <ScrollableView>
                <ScrollableView.Header className='settings-people__header'>
                    <div className='settings-people-header__title'>
                        People
                    </div>
                    <div className='settings-people-header__controls'>
                        <Button type='primary' onClick={openCopyInvitationLinkModal}>Invite Users</Button>
                    </div>
                </ScrollableView.Header>
                <ScrollableView.Body className='settings-people__body'>
                    <Table
                        dataSource={users}
                        columns={tableColumns}
                        rowKey='id'
                        pagination={false}
                        size='small'
                        scroll={{ x: '100%' }}
                    />
                </ScrollableView.Body>
            </ScrollableView>

            <Modal
                title={`Invite Users`}
                closable={true}
                open={isCopyInvitationLinkModalOpen}
                zIndex={2000}
                onCancel={handleCopyInvitationLinkModalClose}
                footer={null}
            >
                <p>
                    To invite users, copy the invitation link and share it with your team.
                </p>
                <div className='settings-people__invitation-link-container'>
                    <Input value={invitationLink} />
                    <Button type='primary' onClick={copyToClipboard}>Copy Link</Button>
                </div>
            </Modal>
            <Modal
                title={`Remove ${selectedUser?.name}?`}
                closable={true}
                open={isRemoveUserModalOpen}
                zIndex={2000}
                onOk={handleRemoveUserModalConfirm}
                onCancel={handleRemoveUserModalCancel}
                footer={[
                    <Button
                        key='back'
                        onClick={handleRemoveUserModalCancel}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        danger
                        onClick={handleRemoveUserModalConfirm}
                    >
                        Remove from Team
                    </Button>
                ]}
            >
                <p>
                    Are you sure you want to remove <b>{`${selectedUser?.name} (${selectedUser?.email})`}</b> from the team?
                </p>
            </Modal>
        </>
    );
}

export default SettingsPeople;
