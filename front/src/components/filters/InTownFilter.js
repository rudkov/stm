import './Filter.css';

import Filter from './Filter';

import { Switch } from 'antd';

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
            contentInHeader={true}
            uniqueName={props.uniqueName}
            applied={props.selectedItem}
        >
            <Switch size='small' onChange={toggleItem} checked={props.selectedItem} />
        </Filter>
    );
}

export default InTownFilter;
