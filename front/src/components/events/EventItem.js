import './EventItem.css';

import * as dayjs from 'dayjs';
import en from "dayjs/locale/en";

import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router';

import { eventActions } from '../../store/events/event';

function EventItem(props) {
    const dispatch = useDispatch();
    // let selectedEvent = useSelector((state) => state.event.selectedItem);

    dayjs.locale({
        ...en,
        weekStart: 1
    });

    let selectedEventStyle;

    // if (selectedEvent.id === props.data.id) {
    //     if (selectedEvent.event_chunk_id === props.data.event_chunk_id) {
    //         selectedEventStyle = 'event-item--selected';
    //     }
    //     else {
    //         selectedEventStyle = 'event-item--selected-chunk';
    //     }
    // }

    return (
        <NavLink key={'event.' + props.data.id} to={props.data.id}>
            <div className={`event-item color--event--${props.data.event_type_system_name} ${selectedEventStyle}`}>
                <div className='event-item--time'>{dayjs(props.data.start_date).format('h:mm a')}</div>
                <div className='event-item--title'>{props.data.title}</div>
                {
                    props.data.talents &&
                    props.data.talents.map((talent) => {
                        return (
                            <div
                                className='event-item--talent'
                                key={'event.talent.' + props.data.id + '.' + props.data.event_chunk_id + '.' + talent.id}
                            >
                                {talent.name}
                            </div>
                        );
                    })
                }
            </div>
        </NavLink>
    );
}

export default EventItem;