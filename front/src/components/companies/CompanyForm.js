import { useCallback } from 'react';

import BaseForm from '../ui-components/BaseForm';

import {
    fetchCompany, getCompany,
    createCompany, getCreateResponse,
    updateCompany, getUpdateResponse,
    deleteCompany, getDeleteResponse,
    companyActions
} from '../../store/companies/company';

import {
    initAddresses, processAddresses,
    initEmails, processEmails,
    initMessengers, processMessengers,
    initPhones, processPhones,
    initSocialMedias, processSocialMedias,
    initWeblinks, processWeblinks
} from '../../helpers/form-utils';

import SharedSectionAddresses from '../nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/edit/SharedSectionSocialMedia';

import CompanySectionPrimaryInfo from '../nested-sections/companies/edit/CompanySectionPrimaryInfo';

function CompanyForm({ isFormOpen, onClose, onAfterSubmit, companyId }) {

    const onInitForm = useCallback((values, form) => {
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
    }, []);

    const onProcessFormData = useCallback((values) => ({
        ...values,
        ...processAddresses(values),
        ...processEmails(values),
        ...processMessengers(values),
        ...processPhones(values),
        ...processSocialMedias(values),
        ...processWeblinks(values),
    }), []);

    const getTitle = useCallback((entity, isNew) => {
        if (isNew) {
            return 'New Company';
        }
        return entity?.name || 'Edit Company';
    }, []);

    const getDeleteConfirmationText = useCallback((entity) => {
        return `Delete ${entity?.name || 'company'}?`;
    }, []);

    return (
        <BaseForm
            entityId={companyId}
            entityName='company'
            entityUrl='/app/companies'

            enableDelete={true}
            enableAnchorNavigation={false}
            formWidth={768}

            crudActions={{
                fetch: fetchCompany,
                create: createCompany,
                update: updateCompany,
                delete: deleteCompany,
                resetResponse: companyActions.resetResponse
            }}

            selectors={{
                entity: getCompany,
                createResponse: getCreateResponse,
                updateResponse: getUpdateResponse,
                deleteResponse: getDeleteResponse
            }}

            onInitForm={onInitForm}
            onProcessFormData={onProcessFormData}
            getTitle={getTitle}
            getDeleteConfirmationText={getDeleteConfirmationText}
            open={isFormOpen}
            onClose={onClose}
            onAfterSubmit={onAfterSubmit}
        >
            <SharedSectionNotes id='notes' />
            <CompanySectionPrimaryInfo id='primary-info' />
            <SharedSectionContacts id='contacts' />
            <SharedSectionSocialMedia id='social-media' />
            <SharedSectionAddresses id='addresses' />
        </BaseForm>
    );
}

export default CompanyForm;
