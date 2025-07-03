import '../../../../helpers/shared.css';
import '../../../../helpers/form.css';

import { Form, Input, Button, Modal } from 'antd';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ReactComponent as IconClose } from '../../../../assets/icons/close.svg';

import { updateLocation, getLocationResponse } from '../../../../store/talents/talent';
import { fetchTalents, fetchTalentsLocations } from '../../../../store/talents/talents';
import { useTalentsFilters } from '../../../talents/TalentsFilters';

import TalentLocation from '../../components/TalentLocation';

function TalentSectionLocation(props) {

    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { filters } = useTalentsFilters();

    const talent = props.talent;
    const locationResponse = useSelector(getLocationResponse);

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
        dispatch(updateLocation([talent.id, values.location]));
    };

    useEffect(() => {
        form.setFieldsValue({
            location: talent.location || '',
        });
    }, [talent, form]);

    useEffect(() => {
        setLoading(false);
        if (locationResponse.status === 'fulfilled') {
            dispatch(fetchTalents(filters));
            dispatch(fetchTalentsLocations());
            setIsModalOpen(false);
        }
    }, [locationResponse, dispatch, filters]);

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
                    <Form.Item name='location'>
                        <Input placeholder="Specify current location" allowClear />
                    </Form.Item>
                    <p>The talent is set "In town" if the field above is empty.</p>
                </Form>
            </Modal>
        </>
    );
};
export default TalentSectionLocation;
