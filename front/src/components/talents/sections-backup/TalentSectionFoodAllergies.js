import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input, Select } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import DataCell from '../../ui-components/DataCell';

function TalentSectionFoodAllergies(props) {
    const talent = useSelector(getTalent);

    const { Option } = Select;
    const { TextArea } = Input;

    return (
        <div>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Food & Allergies</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        label='Allergies'
                        value={talent.allergies}
                    />
                    <DataCell
                        label='Vegetarian'
                        value={talent.is_vegetarian}
                    />
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        label='Allergies'
                        value={
                            <Form.Item name='allergies'>
                                <TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Vegetarian'
                        value={
                            <Form.Item name='is_vegetarian'>
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

export default TalentSectionFoodAllergies;