import './Companies.css';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchCompanies } from '../../store/companies/companies';
import { useCompaniesFilters } from '../companies/CompaniesFilters';

import CompaniesList from '../companies/CompaniesList';

function Companies() {
    const dispatch = useDispatch();
    const { filters, updateFilter } = useCompaniesFilters();

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    return (
        <>
            <div className='companies-page'>
                <CompaniesList
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <div className='companies-page__right-column'>
                    <div className='section-primary'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Companies;