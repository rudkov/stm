import { Form, Radio } from 'antd';

import { useSettings } from '../../../../context/SettingsContext';

import NestedSection from '../../../ui-components/NestedSection';
import { binaryRadioOptions } from '../../../../constants/form';

function TalentSectionPreferences(props) {
    const { settings } = useSettings();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Preferences</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                {
                    settings.talent_preferences.map((preference) => {
                        return (
                            <Form.Item key={preference.system_name} className='talent-form-row__left-label' label={preference.name} name={preference.system_name}>
                                <Radio.Group options={binaryRadioOptions} />
                            </Form.Item>
                        );
                    })
                }
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPreferences;
