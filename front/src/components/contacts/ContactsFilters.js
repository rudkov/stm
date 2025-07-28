import './ContactsFilters.css';

import { useFilters } from '../filters/useFilters';
import ScrollableView from '../ui-components/ScrollableView';

import NoContactsFilter from '../filters/shared/NoContactsFilter';

export const FILTERS_CONFIG = {
    search: {
        name: 'contacts.filters.search',
        value: '',
        storage: (value) => value, // No JSON parsing needed for string
    },
    noContacts: {
        name: 'contacts.filters.noContacts',
        value: false,
        storage: JSON.parse,
    },
};

export function useContactsFilters() {
    return useFilters(FILTERS_CONFIG);
}

export function ContactsFilters({ filters, updateFilter }) {
    return (
        <ScrollableView>
            <ScrollableView.Body className='contacts-filters'>
                <NoContactsFilter
                    uniqueName={FILTERS_CONFIG.noContacts.name}
                    value={filters.noContacts}
                    setValue={(value) => updateFilter('noContacts', value)}
                />
            </ScrollableView.Body>
        </ScrollableView>
    );
}

const ContactsFiltersExports = {
    useContactsFilters,
    FILTERS_CONFIG
};

export default ContactsFiltersExports;
