import './TalentSectionAddresses.css';

import { Button, Form, Input, Select } from 'antd';

import { useTeamSettings } from '../../../../context/TeamSettingsContext';

import NestedSection from '../../NestedSection';

import { ReactComponent as IconDelete } from '../../../../assets/icons/delete-20x20.svg';

function TalentSectionAddresses(props) {
    const { teamSettings } = useTeamSettings();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Addresses</NestedSection.Header>
            <NestedSection.Body className='talent-section-form-addresses__body'>
                <Form.List name='addresses'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-addresses__item' key={`talent.address.${key}`}>
                                        <div className='talent-section-form-addresses__data'>
                                            <Form.Item {...restField} name={[name, 'type', 'id']}>
                                                <Select
                                                    allowClear
                                                    options={teamSettings.communication_types.address.map(item => ({ label: item.name, value: item.id }))}
                                                />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input.TextArea autoSize={{ minRows: 2 }} placeholder='Address' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-addresses__button'>
                                            <Button className='talent-form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                            <Form.Item>
                                <Button type='dashed' onClick={() => add()}>Add Address</Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionAddresses;
