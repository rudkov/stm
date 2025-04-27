import './Filter.css';
import './InTownFilter.css';

import Filter from './Filter';

function InTownFilter(props) {
    const toggleItem = (item) => {
        item = !props.selectedItem;
        props.setFiltered(item);
        sessionStorage.setItem('eventsPage.talentsFilter.query.inTownOnly', JSON.stringify(item));
    }

    const clearFilter = () => {
        const item = false;
        props.setFiltered(item);
        sessionStorage.setItem('eventsPage.talentsFilter.query.inTownOnly', JSON.stringify(item));
    }

    return (
        <Filter
            title='In Town'
            type='switch'
            uniqueName={props.uniqueName}
            applied={props.selectedItem}
            toggleItem={toggleItem}
        >
        </Filter>
    );
}

export default InTownFilter;
