/**
 * Form utility functions for handling form data processing
 */

/**
 * Checks if a regular form object is considered empty
 * An object is empty if it has no meaningful content in key fields
 * 
 * @param {Object} item - The object to check
 * @returns {boolean} - True if the object should be filtered out
 */
export const isEmptyFormObject = (item) => {
    if (!item || typeof item !== 'object') return true;

    // For objects with info property (phones, emails, addresses, relatives)
    if (item.hasOwnProperty('info')) {
        // Filter out if no info at all
        return !item.info || item.info.trim() === '';
    }

    // For other objects, check if any value exists
    const values = Object.values(item);
    const hasValue = values.some(value => {
        if (value === null || value === undefined || value === '') return false;
        if (typeof value === 'number' && value === 0) return false;
        return true;
    });

    return !hasValue;
};

/**
 * Cleans a single form collection array by removing empty objects
 * Use this for regular collections like addresses, emails, phones, relatives
 * 
 * @param {Array} array - The array to filter
 * @returns {Array|null} - The filtered array with empty objects removed, or null if empty
 */
export const cleanFormCollection = (array) => {
    if (!Array.isArray(array)) return array;

    const filtered = array.filter(item => !isEmptyFormObject(item));
    return filtered.length === 0 ? null : filtered;
};

/**
 * Cleans a form collection array for objects that have types (messengers, social_medias)
 * Only filters out null/undefined/non-objects - keeps all valid objects for backend validation
 * 
 * @param {Array} array - The array to filter
 * @returns {Array|null} - The filtered array, or null if empty
 */
export const cleanFormCollectionWithTypes = (array) => {
    if (!Array.isArray(array)) return array;

    // Only filter out null/undefined/non-objects, keep everything else for backend validation
    const filtered = array.filter(item => item && typeof item === 'object');
    return filtered.length === 0 ? null : filtered;
};
