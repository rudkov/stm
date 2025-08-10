export const applyLocalFilters = (items, query) => {
    if (query.searchString !== '') {
        const searchString = query.searchString.toLowerCase();

        items = items.filter((item) => {
            let r = false;

            if (item.name?.toLowerCase().includes(searchString)) {
                r = true;
            }
            else if (item.location?.toLowerCase().includes(searchString)) {
                r = true;
            }
            else if (item.email?.toLowerCase().includes(searchString)) {
                r = true;
            }
            else if (item.phone?.toLowerCase().includes(searchString)) {
                r = true;
            }
            return r;
        });
    }

    return items;
};
