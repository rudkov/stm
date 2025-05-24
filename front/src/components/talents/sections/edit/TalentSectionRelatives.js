import './TalentSectionRelatives.css';

import { Button, Form, Input, Select } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

import { ReactComponent as IconDelete } from '../../../../assets/icons/delete-20x20.svg';

function TalentSectionRelatives(props) {
    const { settings } = useSettings();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Relatives</NestedSection.Header>
            <NestedSection.Body className='talent-section-form-relatives__body'>
                <Form.List name='relatives'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-relatives__item' key={`talent.relative.${key}`}>
                                        <div className='talent-section-form-relatives__data'>
                                            <Form.Item {...restField} name={[name, 'relative_type_id']}>
                                                <Select
                                                    allowClear
                                                    options={settings.talent_relative_types.map(item => ({ label: item.name, value: item.id }))}
                                                />
                                            </Form.Item>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input.TextArea autoSize={{ minRows: 2 }} placeholder='Name, phone, email, address...' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-relatives__button'>
                                            <Button className='talent-form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                            <Form.Item>
                                <Button type='dashed' onClick={() => add()}>Add Relative</Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionRelatives;
