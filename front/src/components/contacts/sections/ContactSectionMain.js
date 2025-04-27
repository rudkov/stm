import '../ContactProfile.css';
import './ContactSectionMain.css';
import '../../../helpers/shared.css';
import '../../../helpers/form.css';

import { useSelector } from 'react-redux';

import { Form, Input, Space, Button } from 'antd';

import { getContact } from '../../../store/contacts/contact';
import DataCell from '../../ui-components/DataCell';

import { LoadingOutlined } from '@ant-design/icons';

function ContactSectionMain(props) {
    const contact = useSelector(getContact);

    const handleCancel = (item) => {
        props.handleCancel(item);
    }

    const handleSave = (item) => {
        props.handleSave(item);
    }

    const toggleForm = () => {
        props.toggleForm();
    }

    const deleteContact = () => {
        props.deleteContact();
    }

    return (
        <div className='contact-profile--main--container'>
            <div className='contact-profile--main--left'>

                <div className="contact-profile--main--content">
                    <div className={`${!props.editMode ? "" : "hidden"}`}>
                        <div className="contact-profile--main--content--text h3">{contact.full_name}</div>
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
            <div className='contact-profile--main--right'>
                <div className={`${!props.editMode ? "" : "hidden"}`}>
                    <Space wrap>
                        <Button type='text' className='button--text' onClick={toggleForm}>Edit</Button>
                    </Space>
                </div>
                <div className={`${props.editMode ? "" : "hidden"}`}>
                    <Space wrap>
                        <LoadingOutlined className={`contact-profile--main--trobber ${props.loading ? "" : "hidden"}`} />
                        {props.isNewContact ? "" : (<Button type='text' className='button--text button--danger' onClick={deleteContact}>Delete</Button>)}
                        <Button type="primary" className='button--primary' onClick={handleSave} disabled={props.loading}>Save</Button>
                        <Button type='text' className='button--text' onClick={handleCancel} disabled={props.loading}>Cancel</Button>
                    </Space>
                </div>
            </div>
        </div>
    );
}

export default ContactSectionMain;