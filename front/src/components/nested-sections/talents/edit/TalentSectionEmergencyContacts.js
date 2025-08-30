import './TalentSectionEmergencyContacts.css';
import '../../../../helpers/form.css';

import { Button, Form, Input } from 'antd';

import NestedSection from '../../NestedSection';

import { ReactComponent as IconDelete } from '../../../../assets/icons/delete-20x20.svg';

function TalentSectionEmergencyContacts(props) {
    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Relatives & Emergency Contacts</NestedSection.Header>
            <NestedSection.Body className='talent-section-form-emergency-contacts__body'>
                <Form.List name='emergency_contacts'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-emergency-contacts__item' key={`talent.emergency-contact.${key}`}>
                                        <div className='talent-section-form-emergency-contacts__data'>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input.TextArea autoSize={{ minRows: 2 }} placeholder='Name, phone, email, address...' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-emergency-contacts__button'>
                                            <Button className='form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                            <Form.Item>
                                <Button type='dashed' onClick={() => add()}>Add Contact</Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionEmergencyContacts;
