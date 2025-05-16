import { DatePicker, Form, Input, Select, Radio } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionPrimaryInfo(props) {
    const { settings } = useSettings();
    const outputDateFormat = 'DD.MM.YYYY';

    const lifestyleOrFashion = [
        {
            value: 'Lifestyle',
            label: 'Lifestyle'
        },
        {
            value: 'Fashion',
            label: 'Fashion'
        },
    ];

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='talent-form-row__left-label' label='First name' name='first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Last name' name='last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Legal first name' name='legal_first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Legal last name' name='legal_last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Birth date' name='birth_date'>
                    <DatePicker format={outputDateFormat} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Gender' name='gender_id'>
                    <Select
                        allowClear
                        options={settings.talent_genders.map(item => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Marital status' name='marital_status_id'>
                    <Select
                        allowClear
                        options={settings.talent_marital_statuses.map(item => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                {/* TODO <div className='nested-section__cell-horizontal'>
                    <div className='text-light'>Mother agency</div>
                    <div><b>Mother agency</b></div>
                </div> */}
                <Form.Item className='talent-form-row__left-label' label='Lifestyle/fashion' name='is_lifestyle'>
                    <Radio.Group options={lifestyleOrFashion} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPrimaryInfo;
