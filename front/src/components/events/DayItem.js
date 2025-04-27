import './DayItem.css';

import * as dayjs from 'dayjs';
import en from "dayjs/locale/en";
import EventItem from './EventItem';

function DayItem(props) {
    dayjs.locale({
        ...en,
        weekStart: 1
    });

    const isToday = (
        props.day.get('D') === dayjs().get('D') &&
        props.day.get('M') === dayjs().get('M') &&
        props.day.get('y') === dayjs().get('y')
    );

    return (
        <td className='calendar-day'>
            <div className='calendar-day--date-container'>
                <div className={`calendar-day--date ${props.isSelectedMonth ? "" : "calendar-day--date--other-month"} ${isToday ? "calendar-day--date--today" : ""}`}>
                    {props.day.get('D')}
                </div>
            </div>
            {
                props.data.map((event) => {
                    const eventStartDate = dayjs(event.start_date);
                    if (props.day.format('DD/MM/YYYY') === eventStartDate.format('DD/MM/YYYY')) {
                        return (
                            <EventItem
                                data={event}
                                key={'event.' + event.event_chunk_id}
                            />
                        );
                    }
                    else {
                        return null;
                    }
                })
            }
        </td>
    );
}

export default DayItem;