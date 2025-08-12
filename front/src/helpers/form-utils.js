/**
 * Form utility functions for handling form data processing
 */

import { sanitizeWeblinkForStorage } from '../components/ui-components/Weblink';

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
 * // For addresses/emails/phones/emergency_contacts (info required, type optional)
 * cleanCollection(values.addresses, { requiredAny: ['info'] })
 * 
 * // For social_medias/messengers (both type and info required)
 * cleanCollection(values.social_medias, { requiredAll: ['type.id', 'info'] })
 * 
 * // For complex nested fields
 * cleanCollection(values.addresses, { requiredAny: ['info'], requiredAll: ['type.id'] })
 */
export const cleanCollection = (array, config = {}) => {
    if (!Array.isArray(array)) return array;

    const filtered = array.filter(item => !isEmptyByConfig(item, config));
    return filtered.length === 0 ? null : filtered;
};


/**
 * Functions to init and process form data
 */

export const initAddresses = (values) => ({
    addresses: (values.addresses && values.addresses.length > 0)
        ? values.addresses
        : [{ type: { id: null }, info: '' }],
});

export const processAddresses = (values) => {
    let processed = {};
    if (values.addresses) {
        processed.addresses = values.addresses.map(item => ({ ...item, type: { id: item.type.id ?? null } }));
    }
    processed.addresses = cleanCollection(processed.addresses, { requiredAny: ['info'] });
    return processed;
};

export const initEmails = (values) => ({
    emails: values.emails || null
});

export const processEmails = (values) => {
    let processed = {};
    if (values.emails) {
        processed.emails = values.emails.map(item => ({ ...item, type: { id: item.type.id ?? null } }));
    }
    processed.emails = cleanCollection(processed.emails, { requiredAny: ['info'] });
    return processed;
};

export const initMessengers = (values) => ({
    messengers: values.messengers || null
});

export const processMessengers = (values) => {
    let processed = {};
    if (values.messengers) {
        processed.messengers = values.messengers.map(item => ({ ...item, type: { id: item.type.id ?? null } }));
    }
    processed.messengers = cleanCollection(processed.messengers, { requiredAll: ['type.id', 'info'] });
    return processed;
};

export const initPhones = (values) => ({
    phones: (values.phones && values.phones.length > 0)
        ? values.phones
        : [{ type: { id: null }, info: '' }],
});

export const processPhones = (values) => {
    let processed = {};
    if (values.phones) {
        processed.phones = values.phones.map(item => ({ ...item, type: { id: item.type.id ?? null } }));
    }
    processed.phones = cleanCollection(processed.phones, { requiredAny: ['info'] });
    return processed;
};

export const initEmergencyContacts = (values) => ({
    emergency_contacts: (values.emergency_contacts && values.emergency_contacts.length > 0)
        ? values.emergency_contacts
        : [{ info: '' }],
});

export const processEmergencyContacts = (values) => {
    let processed = {};
    if (values.emergency_contacts) {
        processed.emergency_contacts = values.emergency_contacts.map(item => ({ ...item }));
    }
    processed.emergency_contacts = cleanCollection(processed.emergency_contacts, { requiredAny: ['info'] });
    return processed;
};

export const initSocialMedias = (values) => ({
    social_medias: (values.social_medias && values.social_medias.length > 0)
        ? values.social_medias
        : [{ type: { id: null }, info: '' }],
});
export const processSocialMedias = (values) => {
    let processed = {};
    if (values.social_medias) {
        processed.social_medias = values.social_medias.map(item => ({ ...item, type: { id: item.type.id ?? null } }));
    }
    processed.social_medias = cleanCollection(processed.social_medias, { requiredAll: ['type.id', 'info'] });
    return processed;
};

export const initWeblinks = (values) => ({
    weblinks: values.weblinks || null
});

export const processWeblinks = (values) => {
    let processed = {};
    if (values.weblinks) {
        processed.weblinks = values.weblinks.map(item => ({
            ...item,
            info: sanitizeWeblinkForStorage(item.info)
        }));
    }
    processed.weblinks = cleanCollection(processed.weblinks, { requiredAny: ['info'] });
    return processed;
};
