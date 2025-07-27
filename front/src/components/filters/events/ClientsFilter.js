import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getCompanies, fetchCompanies } from '../../../store/companies/companies';

import CheckboxFilter from '../CheckboxFilter';

function ClientsFilter(props) {
    const dispatch = useDispatch();
    const companies = useSelector(getCompanies);

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    return (
        <CheckboxFilter
            title='Clients'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={companies}
            isSearchable={true}
        />
    );
}

export default ClientsFilter;
