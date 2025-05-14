import { Form, Input } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionPerformanceSkills(props) {
    const { TextArea } = Input;

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Performance Skills</NestedSection.Header>
            <NestedSection.Body>
                <Form.Item name='performance_skills'>
                    <TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPerformanceSkills;