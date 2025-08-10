export const applyLocalFilters = (items, query) => {
    if (query.searchString !== '') {
        const searchString = query.searchString.toLowerCase();

        items = items.filter((item) => {
            let r = false;
            if (item.name?.toLowerCase().includes(searchString)) {
                r = true;
            }
            return r;
        });
    }

    if (query.locations && Object.keys(query.locations).length > 0) {
        const locations = query.locations;
        items = items.filter((item) => {
            if (locations.includes(null) && item.location === null) {
                return true;
            }
            return item.location !== null && locations.includes(item.location);
        });
    }

    if (query.managers && Object.keys(query.managers).length > 0) {
        const managers = query.managers;
        items = items.filter((item) => {
            return item.manager_id && managers.includes(item.manager_id);
        });
    }

    return items;
};
