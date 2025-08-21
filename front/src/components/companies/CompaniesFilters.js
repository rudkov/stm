import './CompaniesFilters.css';

import { useGetCompanyManagersQuery } from 'api/companies/companiesApi';

import { useFilters } from '../filters/useFilters';
import ScrollableView from '../ui-components/ScrollableView';

import ManagersFilter from '../filters/shared/ManagersFilter';
import NoContactsFilter from '../filters/shared/NoContactsFilter';

export const FILTERS_CONFIG = {
    search: {
        name: 'companies.filters.search',
        value: '',
    },
    managers: {
        name: 'companies.filters.managers',
        value: [],
    },
    noContacts: {
        name: 'companies.filters.noContacts',
        value: false,
        storage: JSON.parse,
    },
};

export function useCompaniesFilters() {
    return useFilters(FILTERS_CONFIG);
}

export function CompaniesFilters({ filters, updateFilter }) {
    const { data: managers } = useGetCompanyManagersQuery();

    return (
        <ScrollableView>
            <ScrollableView.Body className='companies-filters'>
                <ManagersFilter
                    uniqueName={FILTERS_CONFIG.managers.name}
                    data={managers}
                    selectedItems={filters.managers}
                    setFiltered={(value) => updateFilter('managers', value)}
                />
                <NoContactsFilter
                    uniqueName={FILTERS_CONFIG.noContacts.name}
                    value={filters.noContacts}
                    setValue={(value) => updateFilter('noContacts', value)}
                />
            </ScrollableView.Body>
        </ScrollableView>
    );
}

const CompaniesFiltersExports = {
    useCompaniesFilters,
    FILTERS_CONFIG
};

export default CompaniesFiltersExports;
