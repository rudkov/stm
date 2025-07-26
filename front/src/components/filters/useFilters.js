import { useEffect, useState } from 'react';

export function useFilters(FILTERS_CONFIG) {
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
    }, [filters, FILTERS_CONFIG]);

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
