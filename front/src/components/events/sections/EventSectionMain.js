import './EventSectionMain.css';
import '../../../helpers/shared.css';
import '../../../helpers/form.css';

import { useSelector } from 'react-redux';

import { Form, Input, Space, Button, Select } from 'antd';

import { getEvent } from '../../../store/events/event';
import { useSettings } from '../../../context/SettingsContext';

import DataCell from '../../ui-components/DataCell';
import IconColorBadge from '../../ui-components/IconColorBadge';

import { LoadingOutlined } from '@ant-design/icons';

function EventSectionMain(props) {
    const event = useSelector(getEvent);
    const { settings } = useSettings();

    const { Option } = Select;

    const handleCancel = (item) => {
        props.handleCancel(item);
    }

    const handleSave = (item) => {
        props.handleSave(item);
    }

    const toggleForm = () => {
        props.toggleForm();
    }

    const deleteEvent = () => {
        props.deleteEvent();
    }

    let result = null;

    if (event && Object.keys(event).length > 0) {
        result =
            <>
                <div className='info-panel--section'>
                    <div className='info-panel--section_1col text-regular'>
                        <div className={`${!props.editMode ? "" : "hidden"}`}>
                            <Space wrap>
                                <Button type='text' className='button--text' onClick={toggleForm}>Edit</Button>
                            </Space>
                        </div>
                        <div className={`${props.editMode ? "" : "hidden"}`}>
                            <Space wrap>
                                <LoadingOutlined className={`event-profile--main--trobber ${props.loading ? "" : "hidden"}`} />
                                {props.isNewEvent ? "" : (<Button type='text' className='button--text button--danger' onClick={deleteEvent}>Delete</Button>)}
                                <Button type="primary" className='button--primary' onClick={handleSave} disabled={props.loading}>Save</Button>
                                <Button type='text' className='button--text' onClick={handleCancel} disabled={props.loading}>Cancel</Button>
                            </Space>
                        </div>
                    </div>
                </div>

                <div className='info-panel--section'>
                    <div className='info-panel--section_1col text-regular'>
                        <div className={`${!props.editMode ? "" : "hidden"}`}>
                            <div className="h3">{event.title}</div>
                        </div>
                        <div className={`${props.editMode ? "" : "hidden"}`}>
                            <DataCell
                                label='Title'
                                value={
                                    <Form.Item
                                        name='title'
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

                <div className='info-panel--section'>
                    <div className='info-panel--section_1col text-regular'>
                        <div className={`${!props.editMode ? "" : "hidden"}`}>
                            <DataCell
                                className='invisible-bottom-border'
                                icon={<IconColorBadge color={'color--event--' + event.event_type?.system_name} />}
                                label='Type'
                                value={event.event_type?.name}
                            />
                        </div>
                        <div className={`${props.editMode ? "" : "hidden"}`}>
                            <DataCell
                                label='Type'
                                value={
                                    <Form.Item name="event_type_id">
                                        <Select
                                            options={settings.event_types?.map(item => ({
                                                label:
                                                    <div className='select-text-with-icon'>
                                                        <IconColorBadge color={'color--badge-select color--event--' + item.system_name} />
                                                        <div className='select-text-value'>{item.name}</div>
                                                    </div>,
                                                value: item.id
                                            }))}
                                        />
                                    </Form.Item>
                                }
                            />
                        </div>
                    </div>
                </div>
            </>;
    }

    return result;
}

export default EventSectionMain;