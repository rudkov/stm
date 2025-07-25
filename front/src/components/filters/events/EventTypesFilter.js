import '../Filter.css';
import './EventTypesFilter.css';

import Filter from '../Filter';

import { useSettings } from '../../../context/SettingsContext';
import { useTheme } from '../../../context/ThemeContext';

import { ReactComponent as IconCheckSmall } from '../../../assets/icons/check-small.svg';

function EventTypesFilter(props) {
    const { settings } = useSettings();
    const { theme } = useTheme();
    const eventTypes = settings.event_types;

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredEventTypes', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredEventTypes', JSON.stringify(items));
    }

    let result = null;

    if (eventTypes && Object.keys(eventTypes).length > 0) {
        result = eventTypes.map((eventType, index) => {
            const eventTypeColor = theme === 'light' ? eventType.color_light_theme : eventType.color_dark_theme;
            return (
                <div
                    className='filter__checkbox-item'
                    key={'filter.eventTypes.' + eventType.id}
                    onClick={toggleItem.bind(this, eventType.id)}
                >
                    <div className='filter__checkbox' style={{ backgroundColor: eventTypeColor }}>
                        {
                            props.selectedItems?.includes(eventType.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div>{eventType.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Types'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='event-types-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default EventTypesFilter;
