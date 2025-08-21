import { Form, Input, Select } from 'antd';

import { useGetUsersQuery } from 'api/usersApi';

import NestedSection from 'components/nested-sections/NestedSection';

function CompanySectionPrimaryInfo(props) {
    const { data: managers = [] } = useGetUsersQuery();

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='base-form-row__left-label' label='Name' name='name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Manager' name='manager_id'>
                    <Select options={managers.map(item => ({ label: item.name, value: item.id }))} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default CompanySectionPrimaryInfo;
