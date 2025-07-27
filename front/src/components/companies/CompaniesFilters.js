import { useEffect, useState } from 'react';

export const FILTERS_CONFIG = {
    search: {
        name: 'companies.filters.search',
        value: '',
        storage: (value) => value, // No JSON parsing needed for string
    },
};

export function useCompaniesFilters() {
    const [filters, setFilters] = useState(() => {
        const initialFilters = {};
        for (const [key, config] of Object.entries(FILTERS_CONFIG)) {
            const storedValue = sessionStorage.getItem(config.name);
            initialFilters[key] = storedValue !== null
                ? config.storage(storedValue)
                : config.value;
        }
        return initialFilters;
    });

    // Update sessionStorage when filters change
    useEffect(() => {
        Object.entries(FILTERS_CONFIG).forEach(([key, config]) => {
            const value = filters[key];
            const storageValue = typeof value === 'string' ? value : JSON.stringify(value);
            sessionStorage.setItem(config.name, storageValue);
        });
    }, [filters]);

    const updateFilter = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return {
        filters,
        setFilters,
        updateFilter
    };
}

const CompaniesFiltersExports = {
    useCompaniesFilters,
    FILTERS_CONFIG
};

export default CompaniesFiltersExports; 