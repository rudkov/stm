import { Form, Input, Radio } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionFoodAllergies(props) {
    const { TextArea } = Input;
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
            <NestedSection.Body>
                <Form.Item label='Allergies' name='allergies'>
                    <TextArea autoSize={{ minRows: 2 }} />
                </Form.Item>
                <Form.Item label='Vegetarian' name='is_vegetarian'>
                    <Radio.Group options={yesNoOptions} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionFoodAllergies;
