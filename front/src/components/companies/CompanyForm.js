import { useCallback } from 'react';

import BaseForm from 'components/ui-components/BaseForm';

import { useCheckAuthQuery } from 'api/accountApi';

import {
    useGetCompanyQuery,
    useCreateCompanyMutation,
    useUpdateCompanyMutation,
    useDeleteCompanyMutation,
} from 'api/companies/companiesApi';

import {
    initAddresses, processAddresses,
    initEmails, processEmails,
    initMessengers, processMessengers,
    initPhones, processPhones,
    initSocialMedias, processSocialMedias,
    initWeblinks, processWeblinks
} from 'helpers/form-utils';

import SharedSectionAddresses from 'components/nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from 'components/nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from 'components/nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from 'components/nested-sections/shared/edit/SharedSectionSocialMedia';

import CompanySectionPrimaryInfo from 'components/nested-sections/companies/edit/CompanySectionPrimaryInfo';

function CompanyForm({ isFormOpen, onClose, onAfterSubmit, companyId }) {
    const { data: authData } = useCheckAuthQuery();
    const user_id = authData.user.id;

    const onInitForm = useCallback((values, form) => {
        form.setFieldsValue({
            name: values.name || '',
            notes: values.notes || '',

            manager_id: values.manager?.id || user_id,

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

            apiActions={{
                query: useGetCompanyQuery,
                create: useCreateCompanyMutation,
                update: useUpdateCompanyMutation,
                delete: useDeleteCompanyMutation,
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
