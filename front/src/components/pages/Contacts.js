import './Contacts.css';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchContacts } from '../../store/contacts/contacts';
import { useContactsFilters } from '../contacts/ContactsFilters';

import ContactsList from '../contacts/ContactsList';

function Contacts() {
    const dispatch = useDispatch();
    const { filters, updateFilter } = useContactsFilters();

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    return (
        <>
            <div className='contacts-page'>
                <ContactsList
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <div className='contacts-page__right-column'>
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Contacts;