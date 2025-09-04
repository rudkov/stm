export const formatFiltersRequest = (filters) => ({
    year: filters.year,
    month: filters.month,
    day: filters.day,
    clients: filters.clients,
    eventTypes: filters.eventTypes,
    talents: filters.talents,
});
