import { useGetCompaniesQuery } from 'api/companies/companiesApi';

import CheckboxFilter from '../CheckboxFilter';

function ClientsFilter(props) {
    const { data: companies } = useGetCompaniesQuery();

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
