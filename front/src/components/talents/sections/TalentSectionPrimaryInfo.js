import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input, DatePicker, Select } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import { useSettings } from '../../../context/SettingsContext';

import DataCell from '../../ui-components/DataCell';

function TalentSectionPrimaryInfo(props) {
    const talent = useSelector(getTalent);
    const { settings } = useSettings();

    const { Option } = Select;

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Primary Info</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_4col text-regular'>
                    <DataCell
                        className='invisible-bottom-border'
                        label='Legal first name'
                        value={talent.legal_first_name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Legal last name'
                        value={talent.legal_last_name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Birth date'
                        value={talent.birth_date}
                        info={talent.age ? talent.age + ' y.o.' : ''}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Gender'
                        value={talent.gender?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Lifestyle / fashion'
                        value={talent.is_lifestyle}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Marital status'
                        value={talent.marital_status?.name}
                    />
                </div>
            </div>

            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_4col text-regular'>
                    <DataCell
                        label='Legal first name'
                        value={
                            <Form.Item name='legal_first_name' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Legal last name'
                        value={
                            <Form.Item name='legal_last_name' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Birth date'
                        value={
                            <Form.Item name='birth_date' className='form-item--border-bottom'>
                                <DatePicker format={'DD.MM.YYYY'} style={{ width: '100%' }} />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Gender'
                        value={
                            <Form.Item name='gender_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_genders.map((item) => {
                                            return <Option value={item.id} key={`talent_gender_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Lifestyle / fashion'
                        value={
                            <Form.Item name='is_lifestyle' className='form-item--border-bottom'>
                                <Select allowClear>
                                    <Option value="Lifestyle">Lifestyle</Option>
                                    <Option value="Fashion">Fashion</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Marital status'
                        value={
                            <Form.Item name='marital_status_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_marital_statuses.map((item) => {
                                            return <Option value={item.id} key={`talent_marital_status_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default TalentSectionPrimaryInfo;