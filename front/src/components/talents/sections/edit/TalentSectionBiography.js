import { Form, Input } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionBiography(props) {
    const { TextArea } = Input;

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Biography</NestedSection.Header>
            <NestedSection.Body>
                <Form.Item name='biography'>
                    <TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBiography;