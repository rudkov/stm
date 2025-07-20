import BaseForm from '../ui-components/BaseForm';
import { contactFormConfig } from '../../store/contacts/contactFormConfig';

import SharedSectionAddresses from '../nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/edit/SharedSectionSocialMedia';

import ContactSectionPrimaryInfo from '../nested-sections/contacts/edit/ContactSectionPrimaryInfo';

function ContactForm(props) {
    const { isNewContact, open: isFormOpen, closeForm: onClose, onAfterSubmit, contactId } = props;

    return (
        <BaseForm
            {...contactFormConfig}
            entityId={isNewContact ? null : contactId}
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
