import { useCallback } from 'react';

import BaseForm from '../ui-components/BaseForm';

import {
    fetchContact, getContact,
    createContact, getCreateResponse,
    updateContact, getUpdateResponse,
    deleteContact, getDeleteResponse,
    contactActions
} from '../../store/contacts/contact';

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

import ContactSectionPrimaryInfo from '../nested-sections/contacts/edit/ContactSectionPrimaryInfo';

function ContactForm({ isNewContact, open: isFormOpen, closeForm: onClose, onAfterSubmit, contactId }) {

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
            entityId={isNewContact ? null : contactId}
            entityName='contact'
            entityUrl='/app/contacts'

            enableDelete={true}
            enableAnchorNavigation={false}
            formWidth={768}

            crudActions={{
                fetch: fetchContact,
                create: createContact,
                update: updateContact,
                delete: deleteContact,
                resetResponse: contactActions.resetResponse
            }}

            selectors={{
                entity: getContact,
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
            <ContactSectionPrimaryInfo id='primary-info' />
            <SharedSectionContacts id='contacts' />
            <SharedSectionSocialMedia id='social-media' />
            <SharedSectionAddresses id='addresses' />
        </BaseForm>
    );
}

export default ContactForm;
