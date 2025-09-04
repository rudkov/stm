import { useCallback } from 'react';

import BaseForm from 'components/ui-components/BaseForm';

import {
    useGetContactQuery,
    useCreateContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation,
} from 'api/contacts/contactsApi';

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

import ContactSectionPrimaryInfo from 'components/nested-sections/contacts/edit/ContactSectionPrimaryInfo';

function ContactForm({ isFormOpen, onClose, onAfterSubmit, contactId }) {

    const onInitForm = useCallback((values, form) => {
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
    }, []);

    const onProcessFormData = useCallback((values) => ({
        ...values,
        ...processAddresses(values),
        ...processEmails(values),
        ...processMessengers(values),
        ...processPhones(values),
        ...processSocialMedias(values),
        ...processWeblinks(values)
    }), []);

    const getTitle = useCallback((entity, isNew) => {
        if (isNew) {
            return 'New Contact';
        }
        return entity?.first_name + ' ' + entity?.last_name || 'Edit Contact';
    }, []);

    const getDeleteConfirmationText = useCallback((entity) => {
        return `Delete ${entity?.first_name + ' ' + entity?.last_name || 'contact'}?`;
    }, []);

    return (
        <BaseForm
            entityId={contactId}
            entityName='contact'
            entityUrl='/app/contacts'

            enableDelete={true}
            enableAnchorNavigation={false}
            formWidth={768}

            apiActions={{
                query: useGetContactQuery,
                create: useCreateContactMutation,
                update: useUpdateContactMutation,
                delete: useDeleteContactMutation,
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
            <ContactSectionPrimaryInfo id='primary-info' />
            <SharedSectionContacts id='contacts' />
            <SharedSectionSocialMedia id='social-media' />
            <SharedSectionAddresses id='addresses' />
        </BaseForm>
    );
}

export default ContactForm;
