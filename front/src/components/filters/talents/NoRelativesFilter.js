import '../Filter.css';

import Filter from '../Filter';

import { Switch } from 'antd';

function NoContactsFilter(props) {
    const toggleItem = (item) => {
        item = !props.value;
        props.setValue(item);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(item));
    }

    return (
        <Filter
            title='No relatives, < 18 y.o.'
            contentInHeader={true}
            uniqueName={props.uniqueName}
            applied={props.value}
        >
            <Switch size='small' onChange={toggleItem} checked={props.value} />
        </Filter>
    );
}

export default NoContactsFilter;
