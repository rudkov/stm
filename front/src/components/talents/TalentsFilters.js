import './TalentsFilters.css';

import { useFilters } from '../filters/useFilters';
import ScrollableView from '../ui-components/ScrollableView';

import NoContactsFilter from '../filters/shared/NoContactsFilter';

import BoardFilter from '../filters/talents/BoardFilter';
import BodyFilter from '../filters/talents/BodyFilter';
import GendersFilter from '../filters/talents/GendersFilter';
import LocationsFilter from '../filters/talents/LocationsFilter';
import ManagersFilter from '../filters/talents/ManagersFilter';
import PreferencesFilter from '../filters/talents/PreferencesFilter';

export const FILTERS_CONFIG = {
    search: {
        name: 'talents.filters.search',
        value: '',
        storage: (value) => value, // No JSON parsing needed for string
    },
    board: {
        name: 'talents.filters.board',
        value: 0,
        storage: JSON.parse,
    },
    body: {
        name: 'talents.filters.body',
        value: [],
        storage: JSON.parse,
    },
    genders: {
        name: 'talents.filters.genders',
        value: [],
        storage: JSON.parse,
    },
    locations: {
        name: 'talents.filters.locations',
        value: [],
        storage: JSON.parse,
    },
    managers: {
        name: 'talents.filters.managers',
        value: [],
        storage: JSON.parse,
    },
    noContacts: {
        name: 'talents.filters.noContacts',
        value: false,
        storage: JSON.parse,
    },
    preferences: {
        name: 'talents.filters.preferences',
        value: [],
        storage: JSON.parse,
    },
};

export function useTalentsFilters() {
    return useFilters(FILTERS_CONFIG);
}

export function TalentsFilters({ filters, updateFilter }) {
    return (
        <ScrollableView>
            <ScrollableView.Body className='talents-filters'>
                <BoardFilter
                    uniqueName={FILTERS_CONFIG.board.name}
                    value={filters.board}
                    setValue={(value) => updateFilter('board', value)}
                />
                <LocationsFilter
                    uniqueName={FILTERS_CONFIG.locations.name}
                    selectedItems={filters.locations}
                    setFiltered={(value) => updateFilter('locations', value)}
                />
                <ManagersFilter
                    uniqueName={FILTERS_CONFIG.managers.name}
                    selectedItems={filters.managers}
                    setFiltered={(value) => updateFilter('managers', value)}
                />
                <GendersFilter
                    uniqueName={FILTERS_CONFIG.genders.name}
                    selectedItems={filters.genders}
                    setFiltered={(value) => updateFilter('genders', value)}
                />
                <BodyFilter
                    uniqueName={FILTERS_CONFIG.body.name}
                    selectedValues={filters.body}
                    setValues={(value) => updateFilter('body', value)}
                />
                <PreferencesFilter
                    uniqueName={FILTERS_CONFIG.preferences.name}
                    selectedItems={filters.preferences}
                    setFiltered={(value) => updateFilter('preferences', value)}
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

const TalentsFiltersExports = {
    useTalentsFilters,
    TalentsFilters,
    FILTERS_CONFIG
};

export default TalentsFiltersExports;
