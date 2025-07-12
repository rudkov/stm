import './TalentSectionSocialMedia.css';
import '../../../../helpers/form.css';

import { Button, Form, Input, Select } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../NestedSection';

import { ReactComponent as IconDelete } from '../../../../assets/icons/delete-20x20.svg';

import { SocialMediaIcons } from '../../../ui-components/Icons';

function TalentSectionSocialMedia(props) {
    const { settings } = useSettings();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Social Media & Websites</NestedSection.Header>
            <NestedSection.Body className='talent-section-form-social-media__body'>
                <Form.List name='social_medias'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-social-media__item' key={`talent.socialMedia.${key}`}>
                                        <div className='talent-section-form-social-media__data'>
                                            <Form.Item {...restField} name={[name, 'type', 'id']}>
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
                        </>
                    )}
                </Form.List>
                <Form.List name='weblinks'>
                    {(fields, { add, remove }) => (
                        <>
                            {
                                fields.map(({ key, name, ...restField }) => (
                                    <div className='talent-section-form-social-media__item' key={`talent.weblink.${key}`}>
                                        <div className='talent-section-form-social-media__data'>
                                            <div className='talent-section-form-social-media__label'>Website</div>
                                            <Form.Item {...restField} name={[name, 'info']}>
                                                <Input placeholder='Website URL' />
                                            </Form.Item>
                                        </div>
                                        <div className='talent-section-form-social-media__button'>
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
                            const socialMediasList = props.form.getFieldValue('social_medias');
                            props.form.setFieldsValue({
                                social_medias: [...socialMediasList, { type: { id: null }, info: '' }]
                            });
                        }}>Add Social Media</Button>
                    </Form.Item>
                    <Form.Item>
                        <Button type='dashed' onClick={() => {
                            const weblinksList = props.form.getFieldValue('weblinks');
                            props.form.setFieldsValue({
                                weblinks: [...weblinksList, { info: '' }]
                            });
                        }}>Add Website</Button>
                    </Form.Item>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionSocialMedia;
