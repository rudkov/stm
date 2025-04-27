import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import DataCell from '../../ui-components/DataCell';

function TalentSectionPerformanceSkills(props) {
    const talent = useSelector(getTalent);

    const { TextArea } = Input;

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Performance Skills</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        value={talent.performance_skills}
                    />
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        value={
                            <Form.Item name='performance_skills'>
                                <TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default TalentSectionPerformanceSkills;