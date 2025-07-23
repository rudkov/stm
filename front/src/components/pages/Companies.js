import './Companies.css';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchCompanies } from '../../store/companies/companies';
import { useCompaniesFilters } from '../companies/CompaniesFilters';

import CompaniesList from '../companies/CompaniesList';
import CompanyForm from '../companies/CompanyForm';

function Companies() {
    const dispatch = useDispatch();
    const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
    const [currentCompanyId, setCurrentCompanyId] = useState(null);
    const { filters, updateFilter } = useCompaniesFilters();

    useEffect(() => {
        dispatch(fetchCompanies(filters));
    }, [dispatch, filters]);

    const handleSubmit = useCallback(() => {
        dispatch(fetchCompanies(filters));
    }, [dispatch, filters]);

    const createCompany = () => {
        setCurrentCompanyId(null);
        setIsCompanyFormOpen(true);
    }

    const editCompany = (id) => {
        setCurrentCompanyId(id);
        setIsCompanyFormOpen(true);
    }

    const handleClose = () => {
        setIsCompanyFormOpen(false);
        setCurrentCompanyId(null);
    }

    return (
        <>
            <div className='companies-page'>
                <CompaniesList
                    createCompany={createCompany}
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <div className='companies-page__right-column'>
                    <Outlet context={{ editCompany }} />
                </div>
            </div>
            <CompanyForm
                isFormOpen={isCompanyFormOpen}
                onClose={handleClose}
                companyId={currentCompanyId}
                onAfterSubmit={handleSubmit}
            />
        </>
    );
}

export default Companies;
