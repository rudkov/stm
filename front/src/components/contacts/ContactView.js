import './ContactView.css';

import { useParams, useOutletContext } from 'react-router';
import { useEffect, useRef } from 'react';

import { useGetContactQuery } from 'api/contacts/contactsApi';

import ScrollableView from 'components/ui-components/ScrollableView';

import SharedSectionNotes from 'components/nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSystemInfo from 'components/nested-sections/shared/view/SharedSectionSystemInfo';

import ContactSectionCompanies from 'components/nested-sections/contacts/view/ContactSectionCompanies';
import ContactSectionMain from 'components/nested-sections/contacts/view/ContactSectionMain';
import ContactSectionPrimaryInfo from 'components/nested-sections/contacts/view/ContactSectionPrimaryInfo';

function ContactView() {
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
                    <ContactSectionMain
                        data={contact}
                        editAction={context?.editContact}
                    />
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='contact-view__body'>

                    <SharedSectionNotes data={contact} className='company-section__notes' />

                    <ContactSectionPrimaryInfo data={contact} className='contact-section__primary-info' />
                    <ContactSectionCompanies data={contact} className='company-section__companies' />

                    <SharedSectionSystemInfo data={contact} className='company-section__system-info' />

                </ScrollableView.Body>
            </ScrollableView>
    }

    return result;
}

export default ContactView;
