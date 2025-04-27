import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input, Select, Space } from 'antd';

import { useSettings } from '../../../context/SettingsContext';

import { getTalent } from '../../../store/talents/talent';

import DataCell from '../../ui-components/DataCell';

import { ReactComponent as IconCrossInCircle } from '../../../assets/icons/cross-in-circle.svg';

import Button from '../../buttons/Button';

function TalentSectionAddresses(props) {
    const talent = useSelector(getTalent);
    const { settings } = useSettings();

    const { Option } = Select;
    const { TextArea } = Input;

    return (
        <div>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Addresses</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {
                        talent.addresses?.map((item, index) => {
                            return <DataCell
                                key={`talent_address_.${item.id}`}
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
                        name="addresses"
                        initialValue={[
                            { address_type_id: null, info: '' }
                        ]}
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (

                                    <DataCell
                                        key={`talent_address_.${key}`}
                                        value={
                                            <Space.Compact>
                                                <Form.Item {...restField} name={[name, "address_type_id"]} style={{ width: '30%' }}>
                                                    <Select allowClear>
                                                        {
                                                            settings.address_types.map((item, index) => {
                                                                return <Option value={item.id} key={`address_type_.${item.id}`}>{item.name}</Option>;
                                                            })
                                                        }
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item {...restField} name={[name, "info"]} style={{ width: '60%' }}>
                                                    <TextArea autoSize={{ minRows: 1 }} placeholder="Address" />
                                                </Form.Item>
                                                <Button key='talent.addresses.remove' icon={IconCrossInCircle} isSmall={true} onClick={() => remove(name)} />
                                            </Space.Compact>
                                        }
                                    />


                                ))}
                                <Form.Item>
                                    <Button key='talent.addresses.add' title='Add address' onClick={() => add()} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </div>
            </div>
        </div>
    );
}

export default TalentSectionAddresses;