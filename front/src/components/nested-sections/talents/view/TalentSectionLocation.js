import 'helpers/shared.css';
import 'helpers/form.css';

import { Form, Input, Button, Modal } from 'antd';
import { useState, useEffect } from 'react';

import { useUpdateTalentLocationMutation } from 'api/talents/talentsApi';

import TalentLocation from 'components/talents/components/TalentLocation';

import { ReactComponent as IconClose } from 'assets/icons/close.svg';

function TalentSectionLocation(props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [updateLocation, { isLoading, isSuccess }] = useUpdateTalentLocationMutation();

    const talent = props.talent;

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.submit();
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFormSubmit = (values) => {
        updateLocation({ id: talent.id, location: values.location });
    };

    useEffect(() => {
        form.setFieldsValue({
            location: talent.location || '',
        });
    }, [talent, form]);

    useEffect(() => {
        if (isSuccess) {
            setIsModalOpen(false);
        }
    }, [isSuccess]);

    return (
        <>
            <Button
                className='button--invisible text-regular'
                onClick={showModal}
            >
                <TalentLocation location={talent.location} />
            </Button>

            <Modal
                forceRender
                destroyOnClose
                title='Current location'
                open={isModalOpen}
                closeIcon={<IconClose />}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key='back' onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key='submit' type='primary' loading={isLoading} onClick={handleOk}>
                        Save
                    </Button>,
                ]}
            >
                <Form
                    name='talent.location.form'
                    form={form}
                    onFinish={onFormSubmit}
                    preserve={false}
                >
                    <Form.Item name='location'>
                        <Input placeholder='Specify current location' allowClear />
                    </Form.Item>
                    <p>The talent is set "In town" if the field above is empty.</p>
                </Form>
            </Modal>
        </>
    );
};

export default TalentSectionLocation;
