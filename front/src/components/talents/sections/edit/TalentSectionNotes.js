import { Form, Input } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionNotes(props) {
    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Notes</NestedSection.Header>
            <NestedSection.Body>
                <Form.Item name='notes'>
                    <Input.TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionNotes;