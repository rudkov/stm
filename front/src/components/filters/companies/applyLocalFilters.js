export const applyLocalFilters = (items, query) => {
  if (!query.searchString) return items;

  const searchString = query.searchString.toLowerCase();
  return items.filter(item => item.name?.toLowerCase().includes(searchString));
};
