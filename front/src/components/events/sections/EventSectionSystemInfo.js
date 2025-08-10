import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useParams } from 'react-router';
import { useGetEventQuery } from 'api/events/eventsApi';

import DataCell from '../../ui-components/DataCell';

function EventSectionSystemInfo() {
    const params = useParams();
    const { data: event } = useGetEventQuery({ id: params.id }, { skip: !params.id });

    if (!event) {
        return null;
    }

    return (
        <div className='info-panel--section info-panel--system-info'>
            <div className='info-panel--section_2col text-regular'>
                <DataCell
                    label='Updated'
                    value={event.updated_by?.name + ' · ' + event.updated_at}
                />
                <DataCell
                    label='Created'
                    value={event.created_by?.name + ' · ' + event.created_at}
                />
            </div>
        </div>
    );
}

export default EventSectionSystemInfo;