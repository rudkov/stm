import { Form, Input, InputNumber, Select, Radio } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

import IconColorBadge from '../../../ui-components/IconColorBadge';

function TalentSectionBody(props) {
    const { settings } = useSettings();
    const { TextArea } = Input;

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
            <NestedSection.Body>
                <Form.Item label='Height' name='height_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item label='Bust' name='bust_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item label='Waist' name='waist_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item label='Hips' name='hips_cm'>
                    <InputNumber addonAfter='cm' controls={false} />
                </Form.Item>
                <Form.Item label='Weight' name='weight_kg'>
                    <InputNumber addonAfter='kg' controls={false} />
                </Form.Item>
                <Form.Item label='Skin color' name='skin_color_id'>
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
                <Form.Item label='Eyes' name='eye_color_id'>
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
                <Form.Item label='Hair color' name='hair_color_id'>
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
                <Form.Item label='Hair length' name='hair_length_id'>
                    <Select
                        allowClear
                        options={(settings.talent_hair_lengths || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item label='Cups' name='cup_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_cup_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item label='Shirt' name='shirt_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_shirt_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item label='Suit cut' name='suit_cut_id'>
                    <Select
                        allowClear
                        options={(settings.talent_suit_cuts || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item label='Dress size' name='dress_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_dress_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                    />
                </Form.Item>
                <Form.Item label='Shoe' name='shoe_size_id'>
                    <Select
                        allowClear
                        options={(settings.talent_shoe_sizes || []).map((item) => ({ value: item.id, label: item.size_adult_us_men }))}
                    />
                </Form.Item>
                <Form.Item label='Ears pierced' name='is_ears_pierced'>
                    <Radio.Group options={yesNoOptions} />
                </Form.Item>
                <Form.Item label='Scars' name='scars'>
                    <TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
                <Form.Item label='Tattoos' name='tattoos'>
                    <TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
                <Form.Item label='Piercings' name='piercings'>
                    <TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBody;
