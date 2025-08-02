import { useFilters } from '../filters/useFilters';

export const FILTERS_CONFIG = {
    search: {
        name: 'companies.filters.search',
        value: '',
    },
};

export function useCompaniesFilters() {
    return useFilters(FILTERS_CONFIG);
}

const CompaniesFiltersExports = {
    useCompaniesFilters,
    FILTERS_CONFIG
};

export default CompaniesFiltersExports;
