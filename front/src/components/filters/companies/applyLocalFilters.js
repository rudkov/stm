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

    if (query.managers && Object.keys(query.managers).length > 0) {
        const managers = query.managers;
        items = items.filter((item) => {
            return item.manager_id && managers.includes(item.manager_id);
        });
    }

    return items;
};
