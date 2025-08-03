import './Companies.css';

import { useEffect, useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchCompanies } from '../../store/companies/companies';
import { useCompaniesFilters, CompaniesFilters } from '../companies/CompaniesFilters';

import CompaniesList from '../companies/CompaniesList';
import CompanyForm from '../companies/CompanyForm';

function Companies() {
    const dispatch = useDispatch();
    const [isFormOpen, setIsFormOpen] = useState(false);
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
        setIsFormOpen(true);
    }

    const editCompany = (id) => {
        setCurrentCompanyId(id);
        setIsFormOpen(true);
    }

    const handleClose = () => {
        setIsFormOpen(false);
        setCurrentCompanyId(null);
    }

    return (
        <>
            <div className='companies-page'>
                <CompaniesFilters
                    filters={filters}
                    updateFilter={updateFilter}
                />
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
                isFormOpen={isFormOpen}
                onClose={handleClose}
                companyId={currentCompanyId}
                onAfterSubmit={handleSubmit}
            />
        </>
    );
}

export default Companies;
