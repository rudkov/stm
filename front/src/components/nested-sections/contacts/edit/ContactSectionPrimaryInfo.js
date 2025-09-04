import { Form, Input } from 'antd';

import NestedSection from '../../NestedSection';

function ContactSectionPrimaryInfo({ className, id }) {
    return (
        <NestedSection className={className} id={id}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='base-form-row__left-label' label='First name' name='first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Last name' name='last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Job title' name='job_title'>
                    <Input />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default ContactSectionPrimaryInfo;
