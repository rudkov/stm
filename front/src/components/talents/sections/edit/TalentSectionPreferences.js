import { Form, Radio } from 'antd';

import NestedSection from '../../../ui-components/NestedSection';
import { binaryRadioOptions } from '../../../../constants/form';

function TalentSectionPreferences(props) {
    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Preferences</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='talent-form-row__left-label' label='Faithbased ads' name='is_faithbased_ads'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Fur' name='is_fur'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Gambling ads' name='is_gambling_ads'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Lingerie' name='is_lingerie'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Liquor ads' name='is_liquor_ads'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Nude' name='is_nude'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Political ads' name='is_political_ads'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Smoking ads' name='is_smoking_ads'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Sports' name='is_sports'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Swimwear' name='is_swimwear'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Topless' name='is_topless'>
                    <Radio.Group options={binaryRadioOptions} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPreferences;
