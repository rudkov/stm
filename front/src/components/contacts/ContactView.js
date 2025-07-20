import './ContactView.css';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import { getContact, fetchContact } from '../../store/contacts/contact';

import ScrollableView from '../ui-components/ScrollableView';

import SharedSectionAddresses from '../nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from '../nested-sections/shared/view/SharedSectionSystemInfo';

import ContactSectionCompanies from '../nested-sections/contacts/view/ContactSectionCompanies';
import ContactSectionMain from '../nested-sections/contacts/view/ContactSectionMain';

function ContactView({ inLayout = false }) {
    const dispatch = useDispatch();
    const params = useParams();
    const contact = useSelector(getContact);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        dispatch(fetchContact({ id: params.contactId }));
    }, [dispatch, params.contactId]);

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [contact]);

    let result = null;

    if (contact && Object.getPrototypeOf(contact) === Object.prototype) {
        result =
            <ScrollableView className='section-primary'>
                <ScrollableView.Header scrollContainerRef={scrollContainerRef}>
                    <ContactSectionMain data={contact} />
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
