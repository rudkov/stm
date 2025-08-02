import { useEffect, useState } from 'react';

export function useFilters(FILTERS_CONFIG) {
    const [filters, setFilters] = useState(() => {
        const initialFilters = {};
        for (const [key, config] of Object.entries(FILTERS_CONFIG)) {
            const storedValue = sessionStorage.getItem(config.name);
            if (storedValue !== null && storedValue !== '') {
                try {
                    initialFilters[key] = JSON.parse(storedValue);
                } catch (error) {
                    // If JSON parsing fails, fall back to default value
                    initialFilters[key] = config.value;
                }
            } else {
                initialFilters[key] = config.value;
            }
        }
        return initialFilters;
    });

    // Update sessionStorage when filters change
    useEffect(() => {
        Object.entries(FILTERS_CONFIG).forEach(([key, config]) => {
            sessionStorage.setItem(config.name, JSON.stringify(filters[key]));
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
