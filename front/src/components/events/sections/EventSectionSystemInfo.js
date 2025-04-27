import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { getEvent } from '../../../store/events/event';
import DataCell from '../../ui-components/DataCell';

function EventSectionSystemInfo() {
    const event = useSelector(getEvent);

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