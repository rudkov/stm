import './ContactView.css';

import { useParams, useOutletContext } from 'react-router';
import { useEffect, useRef } from 'react';

import { useGetContactQuery } from 'api/contacts/contactsApi';

import ScrollableView from 'components/ui-components/ScrollableView';

import SharedSectionAddresses from 'components/nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from 'components/nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from 'components/nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from 'components/nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from 'components/nested-sections/shared/view/SharedSectionSystemInfo';

import ContactSectionCompanies from 'components/nested-sections/contacts/view/ContactSectionCompanies';
import ContactSectionMain from 'components/nested-sections/contacts/view/ContactSectionMain';

function ContactView({ inLayout = false }) {
    const params = useParams();
    const scrollContainerRef = useRef(null);
    const context = useOutletContext();

    const { data: contact } = useGetContactQuery({ id: params.contactId }, { skip: !params.contactId });

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [contact]);

    let result = null;

    if (contact) {
        result =
            <ScrollableView className='section-primary'>
                <ScrollableView.Header scrollContainerRef={scrollContainerRef}>
                    <ContactSectionMain data={contact} editAction={context?.editContact} />
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='contact-view__body'>

                    <SharedSectionNotes data={contact} className='company-section__notes' />
                    <SharedSectionContacts data={contact} className='company-section__contacts' />
                    <ContactSectionCompanies data={contact} inLayout={inLayout} className='company-section__companies' />
                    <SharedSectionAddresses data={contact} className='company-section__addresses' />
                    <SharedSectionSocialMedia data={contact} className='company-section__social-media' />
                    <SharedSectionSystemInfo data={contact} className='company-section__system-info' />

                </ScrollableView.Body>
            </ScrollableView>
    }

    return result;
}

export default ContactView;
