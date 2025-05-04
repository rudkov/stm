import '../TalentProfile.css';
import '../../../helpers/shared.css';
import '../../../helpers/form.css';

import { Form, Input, Button, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as IconClose } from '../../../assets/icons/close.svg';

import { getTalent, updateCurrentLocation, getCurrentLocationResponse } from '../../../store/talents/talent';
import { fetchTalents } from '../../../store/talents/talents';

import TalentLocation from '../components/TalentLocation';

function TalentSectionCurrentLocation() {

    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const talent = useSelector(getTalent);
    const currentLocationResponse = useSelector(getCurrentLocationResponse);

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
        setLoading(true);
        dispatch(updateCurrentLocation([talent.id, values.current_location]));
    };

    useEffect(() => {
        form.setFieldsValue({
            current_location: talent.current_location || '',
        });
    }, [talent, form]);

    useEffect(() => {
        setLoading(false);
        if (currentLocationResponse.status === 'fulfilled') {
            dispatch(fetchTalents());
            setIsModalOpen(false);
        }
    }, [currentLocationResponse, dispatch]);

    return (
        <>
            <Button
                className='button--invisible text-regular'
                onClick={showModal}
            >
                <TalentLocation location={talent.current_location} />
            </Button>

            <Modal
                forceRender
                destroyOnClose
                title="Current location"
                open={isModalOpen}
                closeIcon={<IconClose />}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
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
                    <Form.Item name='current_location'>
                        <Input placeholder="Specify current location" allowClear />
                    </Form.Item>
                    <p>The talent is set "In town" if the field above is empty.</p>
                </Form>
            </Modal>
        </>
    );
};
export default TalentSectionCurrentLocation;