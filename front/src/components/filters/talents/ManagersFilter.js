import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { getTalentsManagers, fetchTalentsManagers } from '../../../store/talents/talents';
import CheckboxFilter from '../CheckboxFilter';

function ManagersFilter(props) {
    const dispatch = useDispatch();
    const managers = useSelector(getTalentsManagers);

    useEffect(() => {
        dispatch(fetchTalentsManagers());
    }, [dispatch]);

    return (
        <CheckboxFilter
            title='Manager'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={managers}
        />
    );
}

export default ManagersFilter;
