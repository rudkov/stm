import '../TalentProfile.css';
import './TalentSectionMain.css';
import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input, Space, Button } from 'antd';
import { Avatar } from "antd";

import { getTalent } from '../../../store/talents/talent';
import DataCell from '../../ui-components/DataCell';

import { LoadingOutlined } from '@ant-design/icons';

import TalentSectionCurrentLocation from './TalentSectionCurrentLocation';

function TalentSectionMain(props) {
    const talent = useSelector(getTalent);

    const handleCancel = (item) => {
        props.handleCancel(item);
    }

    const handleSave = (item) => {
        props.handleSave(item);
    }

    const toggleForm = () => {
        props.toggleForm();
    }

    const deleteTalent = () => {
        props.deleteTalent();
    }

    return (
        <div className='talent-profile--main--container'>
            <div className='talent-profile--main--left'>

                <div className='talent-profile--main'>
                    <div className="talent-profile--main--avatar">
                        <Avatar size={80}>{talent.full_name?.charAt(0)}</Avatar>
                    </div>
                    <div className="talent-profile--main--content">
                        <div className={`${!props.editMode ? "" : "hidden"}`}>
                            <div className="talent-profile--main--content--text h3">{talent.full_name}</div>
                            <div className="talent-profile--main--content--text text-regular">Mother agency</div>
                            <div className="talent-profile--main--content--text"><TalentSectionCurrentLocation /></div>
                        </div>
                        <div className={`${props.editMode ? "" : "hidden"}`}>
                            <div className='info-panel--section_2col text-regular'>
                                <DataCell
                                    label='First name'
                                    value={
                                        <Form.Item
                                            name='first_name'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'This field is required.',
                                                }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    }
                                />
                                <DataCell
                                    label='Last name'
                                    value={
                                        <Form.Item
                                            name='last_name'
                                            rules={[
                                                {
                                                    required: true,
                                                    message: 'This field is required.',
                                                }]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div className='talent-profile--main--right'>
                <div className={`${!props.editMode ? "" : "hidden"}`}>
                    <Space wrap>
                        <Button type='text' className='button--text' onClick={toggleForm}>Edit</Button>
                    </Space>
                </div>
                <div className={`${props.editMode ? "" : "hidden"}`}>
                    <Space wrap>
                        <LoadingOutlined className={`talent-profile--main--trobber ${props.loading ? "" : "hidden"}`} />
                        {props.isNewTalent ? "" : (<Button type='text' className='button--text button--danger' onClick={deleteTalent}>Delete</Button>)}
                        <Button type="primary" className='button--primary' onClick={handleSave} disabled={props.loading}>Save</Button>
                        <Button type='text' className='button--text' onClick={handleCancel} disabled={props.loading}>Cancel</Button>
                    </Space>
                </div>
            </div>
        </div>
    );
}

export default TalentSectionMain;