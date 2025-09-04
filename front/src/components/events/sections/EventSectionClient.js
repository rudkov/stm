import { useParams } from 'react-router';
import { useGetEventQuery } from 'api/events/eventsApi';

function EventSectionClient(props) {
    const params = useParams();
    const { data: event } = useGetEventQuery({ id: params.id }, { skip: !params.id });

    if (!event) {
        return null;
    }

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Client</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {event.client?.name}
                </div>
                <div className='info-panel--section_1col text-regular'>
                    {
                        event.contacts?.map((item, index) => {
                            return <div key={"event_contact_" + item.id}><span className='text-light'>Contact:</span> {item.full_name}</div>;
                        })
                    }
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>

                    {/* <Form.List name="talents">
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
                    </Form.List> */}

                </div>
            </div>
        </div>
    );
}

export default EventSectionClient;
