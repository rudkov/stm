export const applyLocalFilters = (items, query) => {
  if (!query.searchString) return items;

  const searchString = query.searchString.toLowerCase();
  const fields = ['name', 'location', 'email', 'phone'];

  return items.filter(item =>
    fields.some(field => item[field]?.toLowerCase().includes(searchString))
  );
};
