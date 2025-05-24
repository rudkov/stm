import './TalentSectionSocialMedia.css';
import '../../../../helpers/form.css';

import { Button, Form, Input, Select } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

import { ReactComponent as IconDelete } from '../../../../assets/icons/delete-20x20.svg';

import { SocialMediaIcons } from '../../../ui-components/Icons';

function TalentSectionSocialMedia(props) {
    const { settings } = useSettings();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Social Media</NestedSection.Header>
            <NestedSection.Body className='talent-section-form-social-media__body'>
                <Form.List name='social_medias'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-social-media__item' key={`talent.socialMedia.${key}`}>
                                        <div className='talent-section-form-social-media__data'>
                                            <Form.Item {...restField} name={[name, 'social_media_type_id']}>
                                                <Select
                                                    allowClear
                                                    options={settings.social_media_types.map(item => ({
                                                        label: item.name,
                                                        value: item.id,
                                                        icon: SocialMediaIcons[item.system_name]
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
                                                <Input placeholder='Username' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-social-media__button'>
                                            <Button className='talent-form__icon-button' type='text' icon={<IconDelete />} onClick={() => remove(name)} />
                                        </div>
                                    </div>
                                ))
                            }
                            <Form.Item>
                                <Button type='dashed' onClick={() => add()}>Add Social Media</Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionSocialMedia;
