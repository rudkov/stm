import '../../../../helpers/form.css';

import { Form, Radio, Select } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';

import { Flag } from '../../../ui-components/Flag';

function TalentSectionRegionLanguages(props) {
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
            <NestedSection.Header>Region & Languages</NestedSection.Header>
            <NestedSection.Body>
                <Form.Item label='Citizenships' name='citizenships'>
                    <Select
                        mode='multiple'
                        optionFilterProp='label'
                        options={(settings.countries || []).map((item) => ({
                            value: item.alpha_2,
                            label: item.name,
                            icon: <Flag country={item.alpha_2} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                    />
                </Form.Item>
                <Form.Item label='Languages' name='languages'>
                    <Select
                        mode='multiple'
                        optionFilterProp='label'
                        options={(settings.languages || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                        }))}
                    />
                </Form.Item>
                <Form.Item label='Accent' name='is_accent'>
                    <Radio.Group options={yesNoOptions} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionRegionLanguages;
