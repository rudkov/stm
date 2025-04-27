import './Events.css';

import { Splitter } from 'antd';
import { Outlet } from 'react-router';

import EventsCalendar from '../events/EventsCalendar';

function Events() {
    if (localStorage.getItem("eventsPagePanelSize") === null) {
        localStorage.setItem("eventsPagePanelSize", "300px");
    }

    const panelResized = (item) => {
        let panelSizePercentage = item[0] * 100 / (item[0] + item[1]);
        localStorage.setItem("eventsPagePanelSize", panelSizePercentage + "%");
    }

    return (
        <Splitter onResizeEnd={panelResized}>
            <Splitter.Panel defaultSize={localStorage.getItem("eventsPagePanelSize")} min="20%" max="80%">
                <EventsCalendar />
            </Splitter.Panel>
            <Splitter.Panel>
                <Outlet />
            </Splitter.Panel>
        </Splitter>
    );
}

export default Events;