import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Select } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import { useSettings } from '../../../context/SettingsContext';

import DataCell from '../../ui-components/DataCell';

function TalentSectionRegionLanguages(props) {
    const talent = useSelector(getTalent);
    const { settings } = useSettings();

    const { Option } = Select;

    const citizenships = talent.citizenships?.map((elem) => { return elem.name }).join(", ");
    const languages = talent.languages?.map((elem) => { return elem.name }).join(", ");

    return (
        <div>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Region & Languages</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_2col text-regular'>
                    <DataCell
                        label='Languages'
                        value={languages}
                    />
                    <DataCell
                        label='Citizenships'
                        value={citizenships}
                    />
                    <DataCell
                        label='Accent'
                        value={talent.is_accent}
                    />
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_2col text-regular'>
                    <DataCell
                        label='Languages'
                        value={
                            <Form.Item name='languages'>
                                <Select
                                    mode="multiple"
                                    optionFilterProp="label"
                                    options={(settings.languages || []).map((d) => ({
                                        value: d.id,
                                        label: d.name,
                                    }))}
                                />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Citizenships'
                        value={
                            <Form.Item name='citizenships'>
                                <Select
                                    mode="multiple"
                                    optionFilterProp="label"
                                    options={(settings.countries || []).map((d) => ({
                                        value: d.alpha_2,
                                        label: d.name,
                                    }))}
                                />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Accent'
                        value={
                            <Form.Item name='is_accent'>
                                <Select allowClear>
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default TalentSectionRegionLanguages;