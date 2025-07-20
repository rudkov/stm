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
    const [isNewCompany, setIsNewCompany] = useState();
    const [currentCompanyId, setCurrentCompanyId] = useState(null);
    const { filters, updateFilter } = useCompaniesFilters();

    useEffect(() => {
        dispatch(fetchCompanies(filters));
    }, [dispatch, filters]);

    const fetchAfterSaveOrUpdate = useCallback(() => {
        dispatch(fetchCompanies(filters));
    }, [dispatch, filters]);

    const createCompany = () => {
        setIsNewCompany(true);
        setCurrentCompanyId(null);
        setIsCompanyFormOpen(true);
    }

    const editCompany = (id) => {
        setIsNewCompany(false);
        setCurrentCompanyId(id);
        setIsCompanyFormOpen(true);
    }

    const closeCompanyForm = () => {
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
                open={isCompanyFormOpen}
                closeForm={closeCompanyForm}
                isNewCompany={isNewCompany}
                companyId={currentCompanyId}
                onAfterSubmit={fetchAfterSaveOrUpdate}
            />
        </>
    );
}

export default Companies;
