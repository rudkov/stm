import './Filter.css';
import './LocationsFilter.css';

import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Filter from './Filter';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';
import { getTalentsLocations, fetchTalentsLocations } from '../../store/talents/talents';

function LocationsFilter(props) {
    const dispatch = useDispatch();
    const fetchedTalentsLocations = useSelector(getTalentsLocations);
    const [locations, setLocations] = useState(null);

    useEffect(() => {
        dispatch(fetchTalentsLocations());
    }, [dispatch]);

    useEffect(() => {
        setLocations(fetchedTalentsLocations);
    }, [fetchedTalentsLocations]);

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(items));
    }

    let result = null;

    if (locations && Object.keys(locations).length > 0) {
        result = locations.map((location, index) => {
            return (
                <div
                    className='filter__checkbox-item'
                    key={'filter.locations.' + index}
                    onClick={toggleItem.bind(this, location)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(location)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div>{location ? location : 'In Town'}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Location'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='locations-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default LocationsFilter;
