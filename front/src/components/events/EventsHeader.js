import './EventsHeader.css';

import { useDispatch, useSelector } from 'react-redux';

import { eventsActions } from '../../store/events/events';

import * as dayjs from 'dayjs';
import en from "dayjs/locale/en";

import Button from '../buttons/Button';
import { ReactComponent as IconChevronLeft } from '../../assets/icons/chevron-left.svg';
import { ReactComponent as IconChevronRight } from '../../assets/icons/chevron-right.svg';

function EventsHeader() {

    const dispatch = useDispatch();

    let datesToShow = useSelector((state) => state.events.dates) || [];

    dayjs.locale({
        ...en,
        weekStart: 1
    });

    // const params = useParams();

    let firstDayOfCurrentMonth;

    if (!datesToShow.year || !datesToShow.month || !datesToShow.day) {
        firstDayOfCurrentMonth = dayjs().set('date', 1);
    }
    else {
        firstDayOfCurrentMonth = dayjs(datesToShow.year + '/' + datesToShow.month + '/' + datesToShow.day);
    }

    const previousDate = firstDayOfCurrentMonth.subtract(1, 'month');
    const nextDate = firstDayOfCurrentMonth.add(1, 'month');

    const previousMonth = previousDate.get('M') + 1;
    const nextMonth = nextDate.get('M') + 1;

    const previousYear = previousDate.get('y');
    const nextYear = nextDate.get('y');

    function showToday() {
        const items = {};
        dispatch(eventsActions.setDates({ items }));
        dispatch(eventsActions.updateList());
    }

    function showPreviousMonth() {
        const items = {
            year: previousYear,
            month: previousMonth,
            day: 1,
        };
        dispatch(eventsActions.setDates({ items }));
        dispatch(eventsActions.updateList());
    }

    function showNextMonth() {
        const items = {
            year: nextYear,
            month: nextMonth,
            day: 1,
        };
        dispatch(eventsActions.setDates({ items }));
        dispatch(eventsActions.updateList());
    }

    return (
        <>
            <div className='controls-group'>
                <Button key='calendar.show_today' title='Today' onClick={showToday} />
            </div>
            <div className='controls-group'>
                <Button key='calendar.show_previous_month' icon={IconChevronLeft} onClick={showPreviousMonth} />
                <Button key='calendar.show_next_month' icon={IconChevronRight} onClick={showNextMonth} />
            </div>
            <div className='controls-group controls-group--title'>
                {firstDayOfCurrentMonth.format('MMMM')} {firstDayOfCurrentMonth.get('y')}
            </div>
        </>
    );
}

export default EventsHeader;