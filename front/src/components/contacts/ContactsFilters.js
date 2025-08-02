import { useFilters } from '../filters/useFilters';

export const FILTERS_CONFIG = {
    search: {
        name: 'contacts.filters.search',
        value: '',
    },
};

export function useContactsFilters() {
    return useFilters(FILTERS_CONFIG);
}

const ContactsFiltersExports = {
    useContactsFilters,
    FILTERS_CONFIG
};

export default ContactsFiltersExports;
