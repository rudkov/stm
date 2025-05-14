import { Form, Input } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionAchievements(props) {
    const { TextArea } = Input;

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Achievements</NestedSection.Header>
            <NestedSection.Body>
                <Form.Item name='achievements'>
                    <TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionAchievements;