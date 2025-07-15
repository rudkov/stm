import { Form, Input } from 'antd';

import NestedSection from '../../NestedSection';

function TalentSectionBiography(props) {
    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Biography</NestedSection.Header>
            <NestedSection.Body>
                <Form.Item name='biography'>
                    <Input.TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBiography;