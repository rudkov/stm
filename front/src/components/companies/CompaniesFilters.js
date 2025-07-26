import { useFilters } from '../filters/useFilters';

export const FILTERS_CONFIG = {
    search: {
        name: 'companies.filters.search',
        value: '',
        storage: (value) => value, // No JSON parsing needed for string
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
