import 'helpers/form.css';
import 'helpers/info-panel.css';
import 'helpers/shared.css';

import { useParams } from 'react-router';

import { Form, Select, Space } from 'antd';

import { useGetEventQuery } from 'api/events/eventsApi';
import { useGetTalentsQuery } from 'api/talents/talentsApi';

import Button from 'components/buttons/Button';
import DataCell from 'components/ui-components/DataCell';

import { ReactComponent as IconCrossInCircle } from 'assets/icons/cross-in-circle.svg';
import { ReactComponent as IconTalent } from 'assets/icons/talents.svg';

function EventSectionTalents(props) {
    const params = useParams();
    const { data: talents = [] } = useGetTalentsQuery();
    const { data: event } = useGetEventQuery({ id: params.id }, { skip: !params.id });

    if (!event) {
        return null;
    }

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
