import { Form, Input } from 'antd';

import NestedSection from '../../NestedSection';

function CompanySectionPrimaryInfo(props) {
    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='base-form-row__left-label' label='Name' name='name'>
                    <Input />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default CompanySectionPrimaryInfo;
