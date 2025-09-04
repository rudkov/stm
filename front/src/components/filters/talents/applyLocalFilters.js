export const applyLocalFilters = (items, query) => {
  let filtered = items;

  const { searchString, locations, managers } = query;

  if (searchString) {
    const lowerSearch = searchString.toLowerCase();
    filtered = filtered.filter(item => item.name?.toLowerCase().includes(lowerSearch));
  }

  if (locations && locations.length > 0) {
    filtered = filtered.filter(item =>
      (locations.includes(null) && item.location === null) ||
      (item.location !== null && locations.includes(item.location))
    );
  }

  if (managers && managers.length > 0) {
    filtered = filtered.filter(item => item.manager_id && managers.includes(item.manager_id));
  }

  return filtered;
};
