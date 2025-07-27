import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTalentsLocations, fetchTalentsLocations } from '../../../store/talents/talents';
import CheckboxFilter from '../CheckboxFilter';

function LocationsFilter(props) {
    const dispatch = useDispatch();
    const locations = useSelector(getTalentsLocations);

    useEffect(() => {
        dispatch(fetchTalentsLocations());
    }, [dispatch]);

    return (
        <CheckboxFilter
            title='Location'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={locations}
        />
    );
}

export default LocationsFilter;
