import { Form, Input, InputNumber, Select, Radio } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

import IconColorBadge from '../../../ui-components/IconColorBadge';

function TalentSectionBody(props) {
    const { settings } = useSettings();

    const yesNoOptions = [
        {
            value: 0,
            label: 'No'
        },
        {
            value: 1,
            label: 'Yes'
        },
    ];

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Body</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='talent-form-row__left-label' label='Height' name='height_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Bust' name='bust_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Waist' name='waist_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Hips' name='hips_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Weight' name='weight_kg'>
                    <InputNumber addonAfter='kg' controls={false} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Skin color' name='skin_color_id'>
                    <Select
                        allowClear
                        options={(settings.talent_skin_colors || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                            icon: <IconColorBadge color={'color--badge-select color--skin--' + item.system_name} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Eyes' name='eye_color_id'>
                    <Select
                        allowClear
                        options={(settings.talent_eye_colors || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                            icon: <IconColorBadge color={'color--badge-select color--eyes--' + item.system_name} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Hair color' name='hair_color_id'>
                    <Select
                        allowClear
                        options={(settings.talent_hair_colors || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                            icon: <IconColorBadge color={'color--badge-select color--hair--' + item.system_name} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Hair length' name='hair_length_id'>
                    <Select
                        allowClear
                        options={(settings.talent_hair_lengths || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Cups' name='cup_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_cup_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Shirt' name='shirt_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_shirt_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Suit cut' name='suit_cut_id'>
                    <Select
                        allowClear
                        options={(settings.talent_suit_cuts || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Dress size' name='dress_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_dress_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Shoe' name='shoe_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_shoe_sizes || []).map((item) => ({ value: item.id, label: item.size_adult_us_men }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Ears pierced' name='is_ears_pierced'>
                    <Radio.Group options={yesNoOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Scars' name='scars'>
                    <Input.TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Tattoos' name='tattoos'>
                    <Input.TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Piercings' name='piercings'>
                    <Input.TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBody;
