import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input, Select, Space } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import { useSettings } from '../../../context/SettingsContext';

import DataCell from '../../ui-components/DataCell';

import { ReactComponent as IconCrossInCircle } from '../../../assets/icons/cross-in-circle.svg';

import Button from '../../buttons/Button';

function TalentSectionPhones(props) {
    const talent = useSelector(getTalent);
    const { settings } = useSettings();

    const { Option } = Select;
    const { TextArea } = Input;

    return (
        <div>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Phones</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {
                        talent.phones?.map((item, index) => {
                            return <DataCell
                                key={`talent_phone_.${item.id}`}
                                label={item.type?.name}
                                value={item.info}
                            />;
                        })
                    }
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>

                    <Form.List
                        name="phones"
                        initialValue={[
                            { phone_type_id: null, info: '' }
                        ]}
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (

                                    <DataCell
                                        key={`talent_phone_.${key}`}
                                        value={
                                            <Space.Compact>
                                                <Form.Item {...restField} name={[name, "phone_type_id"]} style={{ width: '30%' }}>
                                                    <Select allowClear>
                                                        {
                                                            settings.phone_types.map((item, index) => {
                                                                return <Option value={item.id} key={`phone_type_.${item.id}`}>{item.name}</Option>;
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, "info"]} style={{ width: '60%' }}>
                                                    <TextArea autoSize={{ minRows: 1 }} placeholder="Phone" />
                                                </Form.Item>
                                                <Button key='talent.phones.remove' icon={IconCrossInCircle} isSmall={true} onClick={() => remove(name)} />
                                            </Space.Compact>
                                        }
                                    />


                                ))}
                                <Form.Item>
                                    <Button key='talent.phones.add' title='Add phone' onClick={() => add()} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </div>
            </div>
        </div>
    );
}

export default TalentSectionPhones;