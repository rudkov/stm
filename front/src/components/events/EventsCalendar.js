import './EventsCalendar.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import * as dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import * as weekday from 'dayjs/plugin/weekday';
import _ from 'lodash';

import DayItem from './DayItem';

import { getEvents, fetchEvents } from '../../store/events/events';

import ClientsFilter from '../filters/ClientsFilter';
import EventTypesFilter from '../filters/EventTypesFilter';
import TalentsFilter from '../filters/TalentsFilter';


function EventsCalendar() {
    const dispatch = useDispatch();
    const events = useSelector(getEvents);
    let datesToShow = useSelector((state) => state.events.dates) || [];

    const [filteredClients, setFilteredClients] = useState(JSON.parse(sessionStorage.getItem('eventsPage.filteredClients')) ?? []);
    const [filteredEventTypes, setFilteredEventTypes] = useState(JSON.parse(sessionStorage.getItem('eventsPage.filteredEventTypes')) ?? []);
    const [filteredTalents, setFilteredTalents] = useState(JSON.parse(sessionStorage.getItem('eventsPage.filteredTalents')) ?? []);

    dayjs.locale({
        ...en,
        weekStart: 1
    });

    dayjs.extend(weekday);

    let firstDayOfCurrentMonth;

    if (!datesToShow.year || !datesToShow.month || !datesToShow.day) {
        firstDayOfCurrentMonth = dayjs().set('date', 1);
    }
    else {
        firstDayOfCurrentMonth = dayjs(datesToShow.year + '/' + datesToShow.month + '/' + datesToShow.day);
    }

    const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const daysInMonth = firstDayOfCurrentMonth.daysInMonth();
    const daysInPreviousMonth = firstDayOfCurrentMonth.subtract(dayjs().get('D'), 'day').daysInMonth();
    const firstDayInMonth = firstDayOfCurrentMonth.date(1).weekday();
    const firstDayInPreviousMonth = daysInPreviousMonth - firstDayInMonth + 1;

    const previousMonth = firstDayOfCurrentMonth.subtract(dayjs().get('D'), 'day');

    const firstDayOfCal = previousMonth.set('date', firstDayInPreviousMonth);

    let dates = [];

    let numberOfDays = 0;

    numberOfDays = daysInPreviousMonth - firstDayInPreviousMonth + 1 + daysInMonth;
    numberOfDays = numberOfDays + 7 - numberOfDays % 7;

    for (let i = 0; i < numberOfDays; i++) {
        dates = [...dates, firstDayOfCal.add(i, 'day')];
    }

    const weeks = _.chunk(dates, 7);

    useEffect(() => {
        dispatch(fetchEvents({
            year: firstDayOfCurrentMonth.get('y'),
            month: firstDayOfCurrentMonth.get('M') + 1,
            day: firstDayOfCurrentMonth.get('D'),
            clients: filteredClients,
            eventTypes: filteredEventTypes,
            talents: filteredTalents,
        }));
    }, [dispatch, filteredClients, filteredEventTypes, filteredTalents]);

    let result = null;

    if (events && Object.keys(events).length > 0) {
        result =
            <table className='calendar'>
                <thead>
                    <tr>
                        {WEEKDAYS.map((day, index) => {
                            return (
                                <td className='calendar-day calendar-day--weekday' key={'head.' + index}>{day}</td>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, index) => {
                        return (
                            <tr key={'week.' + index}>
                                {week.map((day, sIndex) => {
                                    return <DayItem
                                        data={events}
                                        day={day}
                                        isSelectedMonth={(firstDayOfCurrentMonth.get('M') === day.get('M')) ? true : false}
                                        key={'day.' + day.get('D') + '.' + day.get('M')}
                                    />
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            ;
    }
    return (
        <div className='events-calendar-page'>
            <div className='events-calendar-page__filters scrollbar-y'>
                <EventTypesFilter
                    uniqueName='eventsPage.eventTypesFilter'
                    selectedItems={filteredEventTypes}
                    setFiltered={setFilteredEventTypes}
                />
                <TalentsFilter
                    uniqueName='eventsPage.talentsFilter'
                    selectedItems={filteredTalents}
                    setFiltered={setFilteredTalents}
                />
                <ClientsFilter
                    uniqueName='eventsPage.clientsFilter'
                    selectedItems={filteredClients}
                    setFiltered={setFilteredClients}
                />
            </div>
            <div className='events-calendar'>
                {result}
            </div>
        </div>
    );
}

export default EventsCalendar;
