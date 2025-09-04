import './Contacts.css';

import { useState } from 'react';
import { Outlet } from 'react-router';

import { useGetContactsQuery } from 'api/contacts/contactsApi';
import { useContactsFilters, ContactsFilters } from 'components/contacts/ContactsFilters';

import ContactsList from 'components/contacts/ContactsList';
import ContactForm from 'components/contacts/ContactForm';

function Contacts() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentContactId, setCurrentContactId] = useState(null);
    const { filters, updateFilter } = useContactsFilters();

    useGetContactsQuery(filters);

    const createContact = () => {
        setCurrentContactId(null);
        setIsFormOpen(true);
    }

    const editContact = (id) => {
        setCurrentContactId(id);
        setIsFormOpen(true);
    }

    const handleClose = () => {
        setIsFormOpen(false);
        setCurrentContactId(null);
    }

    return (
        <>
            <div className='contacts-page'>
                <ContactsFilters
                    filters={filters}
                    updateFilter={updateFilter}
                />
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
                isFormOpen={isFormOpen}
                onClose={handleClose}
                contactId={currentContactId}
            />
        </>
    );
}

export default Contacts;
