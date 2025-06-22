/**
 * Form utility functions for handling form data processing
 */

/**
 * Checks if a field value is considered empty
 * 
 * @param {any} value - The value to check
 * @returns {boolean} - True if the value is empty
 */
const isEmpty = (value) => {
    if (value === null || value === undefined || value === '') return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (typeof value === 'object' && value.hasOwnProperty('id')) return isEmpty(value.id);
    return false;
};

/**
 * Checks if a form object meets the specified requirements
 * 
 * @param {Object} item - The object to check
 * @param {Object} config - Configuration object
 * @param {string[]} config.requiredAll - Fields that must all be non-empty
 * @param {string[]} config.requiredAny - At least one of these fields must be non-empty
 * @returns {boolean} - True if the object should be filtered out
 */
const isEmptyByConfig = (item, config = {}) => {
    if (!item || typeof item !== 'object') return true;

    const { requiredAll = [], requiredAny = [] } = config;

    // Check requiredAll fields (all must be non-empty)
    if (requiredAll.length > 0) {
        const allRequiredMet = requiredAll.every(field => {
            const value = field.includes('.') ? getNestedValue(item, field) : item[field];
            return !isEmpty(value);
        });
        if (!allRequiredMet) {
            return true; // Filter out if any required field is empty
        }
    }

    // Check requiredAny fields (at least one must be non-empty)
    if (requiredAny.length > 0) {
        const anyRequiredMet = requiredAny.some(field => {
            const value = field.includes('.') ? getNestedValue(item, field) : item[field];
            return !isEmpty(value);
        });
        if (!anyRequiredMet) {
            return true; // Filter out if all requiredAny fields are empty
        }
    }

    return false;
};

/**
 * Helper function to get nested object values (e.g., 'type.id')
 * 
 * @param {Object} obj - The object to get value from
 * @param {string} path - Dot notation path (e.g., 'type.id')
 * @returns {any} - The value at the path
 */
const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
};

/**
 * Cleans a form collection array by removing empty objects based on configuration
 * 
 * @param {Array} array - The array to filter
 * @param {Object} config - Configuration object
 * @param {string[]} config.requiredAll - Fields that must all be non-empty
 * @param {string[]} config.requiredAny - At least one of these fields must be non-empty
 * @returns {Array|null} - The filtered array with empty objects removed, or null if empty
 * 
 * @example
 * // For addresses/emails/phones/relatives (info required, type optional)
 * cleanCollection(values.addresses, { requiredAny: ['info'] })
 * 
 * // For social_medias/messengers (both type and info required)
 * cleanCollection(values.social_medias, { requiredAll: ['social_media_type_id', 'info'] })
 * 
 * // For complex nested fields
 * cleanCollection(values.addresses, { requiredAny: ['info'], requiredAll: ['type.id'] })
 */
export const cleanCollection = (array, config = {}) => {
    if (!Array.isArray(array)) return array;

    const filtered = array.filter(item => !isEmptyByConfig(item, config));
    return filtered.length === 0 ? null : filtered;
};
