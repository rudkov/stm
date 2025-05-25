import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';
import '../../ui-components/IconBadge.css';

import { useSelector } from 'react-redux';

import { Form, Input, Select, Space } from 'antd';

import { getContact } from '../../../store/contacts/contact';
import { useSettings } from '../../../context/SettingsContext';

import DataCell from '../../ui-components/DataCell';

// Import SVG files as regular imports
import { ReactComponent as IconCrossInCircle } from '../../../assets/icons/cross-in-circle.svg';
import { MessengersIcons } from '../../ui-components/Icons';
import Button from '../../buttons/Button';

function ContactSectionMessengers(props) {
    const contact = useSelector(getContact);
    const { settings } = useSettings();

    const { Option } = Select;

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Messengers</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {
                        contact.messengers?.map((item, index) => {
                            return <DataCell
                                icon={MessengersIcons[item.type?.system_name]}
                                key={`contact_messenger_.${item.id}`}
                                label={item.type?.name}
                                value={<a href={`${item.type?.url + item.info}`} target='_blank' rel='noreferrer'>{item.info}</a>}
                            />;
                        })
                    }
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>

                    <Form.List
                        name="messengers"
                        initialValue={[
                            { messengers_type_id: null, info: '' }
                        ]}
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (

                                    <DataCell
                                        key={`contact_messenger_.${key}`}
                                        value={
                                            <Space.Compact>
                                                <Form.Item {...restField} name={[name, "messenger_type_id"]} style={{ width: '30%' }}>
                                                    <Select allowClear>
                                                        {
                                                            settings.messenger_types.map((item, index) => {
                                                                return <Option value={item.id} key={`messenger_type_.${item.id}`}><div className='select--badge select--badge-select'>{MessengersIcons[item.system_name]}</div>{item.name}</Option>;
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, "info"]} style={{ width: '60%' }}>
                                                    <Input.TextArea autoSize={{ minRows: 1 }} placeholder="Username" />
                                                </Form.Item>
                                                <Button key='contact.messengers.remove' icon={IconCrossInCircle} isSmall={true} onClick={() => remove(name)} />
                                            </Space.Compact>
                                        }
                                    />

                                ))}
                                <Form.Item>
                                    <Button key='contact.messengers.add' title='Add messenger' onClick={() => add()} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </div>
            </div>
        </div>
    );
}

export default ContactSectionMessengers;