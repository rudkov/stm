import {
    fetchCompany, getCompany,
    createCompany, getCreateResponse,
    updateCompany, getUpdateResponse,
    deleteCompany, getDeleteResponse,
    companyActions
} from './company';

import {
    initAddresses, processAddresses,
    initEmails, processEmails,
    initPhones, processPhones,
    initMessengers, processMessengers,
    initSocialMedias, processSocialMedias,
    initWeblinks, processWeblinks
} from '../../helpers/form-utils';

export const companyFormConfig = {
    entityName: 'company',
    entityUrl: '/app/companies',
    enableDelete: true,
    enableAnchorNavigation: false,
    formWidth: 768,

    crudActions: {
        fetch: fetchCompany,
        create: createCompany,
        update: updateCompany,
        delete: deleteCompany,
        resetResponse: companyActions.resetResponse
    },

    selectors: {
        entity: getCompany,
        createResponse: getCreateResponse,
        updateResponse: getUpdateResponse,
        deleteResponse: getDeleteResponse
    },

    onInitForm: (values, form) => {
        form.setFieldsValue({
            name: values.name || '',
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
            return 'New Company';
        }
        return entity?.name || 'Edit Company';
    },

    getDeleteConfirmationText: (entity) => {
        return `Delete ${entity?.name || 'company'}?`;
    }
};
