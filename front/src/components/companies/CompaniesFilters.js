import './CompaniesFilters.css';

import { useFilters } from '../filters/useFilters';
import ScrollableView from '../ui-components/ScrollableView';

import NoContactsFilter from '../filters/shared/NoContactsFilter';

export const FILTERS_CONFIG = {
    search: {
        name: 'companies.filters.search',
        value: '',
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
    return (
        <ScrollableView>
            <ScrollableView.Body className='companies-filters'>
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
