import './TalentSectionContacts.css';
import '../../../../helpers/form.css';

import { Button, Form, Input, Select } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';
import { useTeamSettings } from '../../../../context/TeamSettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

import { ReactComponent as IconDelete } from '../../../../assets/icons/delete-20x20.svg';

import { MessengersIcons } from '../../../ui-components/Icons';

function TalentSectionContacts(props) {
    const { settings } = useSettings();
    const { teamSettings } = useTeamSettings();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Contacts</NestedSection.Header>
            <NestedSection.Body className='talent-section-form-contacts__body'>
                <Form.List name='phones'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-contacts__item' key={`talent.phone.${key}`}>
                                        <div className='talent-section-form-contacts__data'>
                                            <Form.Item {...restField} name={[name, 'type', 'id']}>
                                                <Select
                                                    allowClear
                                                    options={teamSettings.communication_types.phone.map(item => ({
                                                        label: item.name,
                                                        value: item.id,
                                                    }))}
                                                />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input placeholder='Phone number' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-contacts__button'>
                                            <Button className='talent-form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    )}
                </Form.List>
                <Form.List name='emails'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-contacts__item' key={`talent.email.${key}`}>
                                        <div className='talent-section-form-contacts__data'>
                                            <Form.Item {...restField} name={[name, 'type', 'id']}>
                                                <Select
                                                    allowClear
                                                    options={teamSettings.communication_types.email.map(item => ({
                                                        label: item.name,
                                                        value: item.id,
                                                    }))}
                                                />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input placeholder='Email' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-contacts__button'>
                                            <Button className='talent-form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    )}
                </Form.List>
                <Form.List name='messengers'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-contacts__item' key={`talent.messenger.${key}`}>
                                        <div className='talent-section-form-contacts__data'>
                                            <Form.Item {...restField} name={[name, 'type', 'id']}>
                                                <Select
                                                    allowClear
                                                    options={settings.messenger_types.map(item => ({
                                                        label: item.name,
                                                        value: item.id,
                                                        icon: MessengersIcons[item.system_name]
                                                    }))}
                                                    optionRender={(option) => (
                                                        <div className='select-option-with-icon'>
                                                            {option.data.icon}
                                                            {option.data.label}
                                                        </div>
                                                    )}
                                                />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input placeholder='Messenger' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-contacts__button'>
                                            <Button className='talent-form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    )}
                </Form.List>
                <div className='talent-section-form-contacts__controls'>
                    <Form.Item>
                        <Button type='dashed' onClick={() => {
                            const phonesList = props.form.getFieldValue('phones');
                            props.form.setFieldsValue({
                                phones: [...phonesList, { type: { id: null }, info: '' }]
                            });
                        }}>Add Phone</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type='dashed' onClick={() => {
                            const emailsList = props.form.getFieldValue('emails');
                            props.form.setFieldsValue({
                                emails: [...emailsList, { type: { id: null }, info: '' }]
                            });
                        }}>Add Email</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type='dashed' onClick={() => {
                            const messengersList = props.form.getFieldValue('messengers');
                            props.form.setFieldsValue({
                                messengers: [...messengersList, { type: { id: null }, info: '' }]
                            });
                        }}>Add Messenger</Button>
                    </Form.Item>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionContacts;
