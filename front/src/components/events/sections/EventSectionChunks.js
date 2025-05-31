import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

// import { useEffect } from 'react';
import { useSelector } from 'react-redux';

// import { Form, Select, Space } from 'antd';

import { getEvent } from '../../../store/events/event';

// import DataCell from '../../ui-components/DataCell';

// import { ReactComponent as IconCrossInCircle } from '../../../assets/icons/cross-in-circle.svg';

// import Button from '../../buttons/Button';

function EventSectionChunks(props) {
    // const dispatch = useDispatch();
    const event = useSelector(getEvent);

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Time</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {
                        event.event_chunks?.map((item, index) => {
                            return <div key={"event_chunk_" + item.id}>{item.start_date_readable} – {item.end_date_readable}</div>;
                        })
                    }
                </div>
            </div>
            {/* <div className={`${props.editMode ? "" : "hidden"}`}>
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
            </div> */}

            {/* <div>
                <div className='event-info--section-header'>Time</div>
                <div className='event-info--section-content'>
                    {
                        event.event_chunks &&
                        event.event_chunks.map((item, index) => {
                            return (
                                <div key={'event.dates.' + item.id}>
                                    <DatePicker
                                        bordered={false}
                                        suffixIcon={false}
                                        clearIcon={false}
                                        format={'D MMMM YYYY'}
                                        className='input--background-on-hover'
                                        key={'event.start_date.' + item.id}
                                        // style={{width: '140px'}}
                                        defaultValue={dayjs(item.start_date)}
                                    />
                                    <TimePicker
                                        bordered={false}
                                        suffixIcon={null}
                                        key={'event.start_time.' + item.id}
                                        date={item.start_date}
                                    />–
                                    <TimePicker
                                        bordered={false}
                                        suffixIcon={null}
                                        key={'event.end_time.' + item.id}
                                        date={item.end_date}
                                    />
                                </div>
                            );
                        })
                    }
                </div>
            </div> */}
            
        </div>
    );
}

export default EventSectionChunks;