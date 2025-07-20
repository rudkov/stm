import {
    fetchContact, getContact,
    createContact, getCreateResponse,
    updateContact, getUpdateResponse,
    deleteContact, getDeleteResponse,
    contactActions
} from './contact';

import {
    initAddresses, processAddresses,
    initEmails, processEmails,
    initPhones, processPhones,
    initMessengers, processMessengers,
    initSocialMedias, processSocialMedias,
    initWeblinks, processWeblinks
} from '../../helpers/form-utils';

export const contactFormConfig = {
    entityName: 'contact',
    entityUrl: '/app/contacts',
    enableDelete: true,
    enableAnchorNavigation: false,
    formWidth: 768,

    crudActions: {
        fetch: fetchContact,
        create: createContact,
        update: updateContact,
        delete: deleteContact,
        resetResponse: contactActions.resetResponse
    },

    selectors: {
        entity: getContact,
        createResponse: getCreateResponse,
        updateResponse: getUpdateResponse,
        deleteResponse: getDeleteResponse
    },

    onInitForm: (values, form) => {
        form.setFieldsValue({
            first_name: values.first_name || '',
            last_name: values.last_name || '',
            notes: values.notes || '',

            ...initAddresses(values),
            ...initEmails(values),
            ...initMessengers(values),
            ...initPhones(values),
            ...initSocialMedias(values),
            ...initWeblinks(values),
        });
    },

    onProcessFormData: (values) => {
        const processed = { ...values };

        return {
            ...processed,
            ...processAddresses(processed),
            ...processEmails(processed),
            ...processPhones(processed),
            ...processMessengers(processed),
            ...processSocialMedias(processed),
            ...processWeblinks(processed),
        };
    },

    getTitle: (entity, isNew) => {
        if (isNew) {
            return 'New Contact';
        }
        return entity?.first_name + ' ' + entity?.last_name || 'Edit Contact';
    },

    getDeleteConfirmationText: (entity) => {
        return `Delete ${entity?.first_name + ' ' + entity?.last_name || 'contact'}?`;
    }
};
