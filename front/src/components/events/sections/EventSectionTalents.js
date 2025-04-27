import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Select, Space } from 'antd';

import { getEvent } from '../../../store/events/event';
import { getTalents, fetchTalents } from '../../../store/talents/talents';

import DataCell from '../../ui-components/DataCell';

import { ReactComponent as IconCrossInCircle } from '../../../assets/icons/cross-in-circle.svg';
import { ReactComponent as IconTalent } from '../../../assets/icons/talents.svg';

import Button from '../../buttons/Button';

function EventSectionTalents(props) {
    const dispatch = useDispatch();
    const event = useSelector(getEvent);
    const talents = useSelector(getTalents);

    useEffect(() => {
        dispatch(fetchTalents());
    }, [dispatch]);

    const showTalentInfo = (item) => {
        props.showTalentInfo(item);
    }

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Talents</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {
                        event.talents?.map((item, index) => {
                            return (
                                <div key={"event_talent_" + item.id}>
                                    {item.full_name}
                                    <span className='text-light'> – {item.pivot.cost}</span>
                                    <Button key='event.talents.showInfo' icon={IconTalent} isSmall={true} onClick={showTalentInfo.bind(this, item.id)} />
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>

                    <Form.List name="talents">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (

                                    <DataCell
                                        key={`event_talent_.${key}`}
                                        value={
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "id"]}
                                                    style={{ width: '80%' }}
                                                >
                                                    <Select
                                                        showSearch
                                                        optionFilterProp="label"
                                                        options={talents.map(item => ({ label: item.name, value: item.id }))}
                                                    />
                                                </Form.Item>
                                                <Button key='event.talents.remove' icon={IconCrossInCircle} isSmall={true} onClick={() => remove(name)} />
                                            </Space.Compact>
                                        }
                                    />
                                ))}
                                <Form.Item>
                                    <Button key='event.talents.add' title='Add talent' onClick={() => add()} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </div>
            </div>
        </div>
    );
}

export default EventSectionTalents;