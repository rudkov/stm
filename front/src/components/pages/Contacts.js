import './Contacts.css';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchCompanies } from '../../store/contacts/companies';
import { useContactsFilters } from '../contacts/ContactsFilters';

import CompaniesList from '../contacts/CompaniesList';

function Contacts() {
    const dispatch = useDispatch();
    const { filters, updateFilter } = useContactsFilters();

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    return (
        <>
            <div className='contacts-page'>
                <CompaniesList
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <div className='contacts-page__right-column'>
                    <div className='section-primary'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contacts;