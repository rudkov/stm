import { Form, Input, Radio } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionFoodAllergies(props) {
    const yesNoOptions = [
        {
            value: 0,
            label: 'No'
        },
        {
            value: 1,
            label: 'Yes'
        },
    ];

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Food & Allergies</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='talent-form-row__left-label' label='Allergies' name='allergies'>
                    <Input.TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Vegetarian' name='is_vegetarian'>
                    <Radio.Group options={yesNoOptions} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionFoodAllergies;
