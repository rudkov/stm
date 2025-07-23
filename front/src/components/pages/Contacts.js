import './Contacts.css';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchContacts } from '../../store/contacts/contacts';
import { useContactsFilters } from '../contacts/ContactsFilters';

import ContactsList from '../contacts/ContactsList';
import ContactForm from '../contacts/ContactForm';

function Contacts() {
    const dispatch = useDispatch();
    const [isContactFormOpen, setContactFormOpen] = useState(false);
    const [currentContactId, setCurrentContactId] = useState(null);
    const { filters, updateFilter } = useContactsFilters();

    useEffect(() => {
        dispatch(fetchContacts(filters));
    }, [dispatch, filters]);

    const handleSubmit = useCallback(() => {
        dispatch(fetchContacts(filters));
    }, [dispatch, filters]);

    const createContact = () => {
        setCurrentContactId(null);
        setContactFormOpen(true);
    }

    const editContact = (id) => {
        setCurrentContactId(id);
        setContactFormOpen(true);
    }

    const handleClose = () => {
        setContactFormOpen(false);
        setCurrentContactId(null);
    }

    return (
        <>
            <div className='contacts-page'>
                <ContactsList
                    createContact={createContact}
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <div className='contacts-page__right-column'>
                    <Outlet context={{ editContact }} />
                </div>
            </div>
            <ContactForm
                isFormOpen={isContactFormOpen}
                onClose={handleClose}
                contactId={currentContactId}
                onAfterSubmit={handleSubmit}
            />
        </>
    );
}

export default Contacts;
