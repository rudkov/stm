import './Companies.css';

import { useState } from 'react';
import { Outlet } from 'react-router';

import { useGetCompaniesQuery } from 'api/companies/companiesApi';
import { useCompaniesFilters, CompaniesFilters } from 'components/companies/CompaniesFilters';

import CompaniesList from 'components/companies/CompaniesList';
import CompanyForm from 'components/companies/CompanyForm';
import ContactForm from 'components/contacts/ContactForm';

function Companies() {
    const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);
    const [isContactFormOpen, setIsContactFormOpen] = useState(false);
    const [currentCompanyId, setCurrentCompanyId] = useState(null);
    const [currentContactId, setCurrentContactId] = useState(null);
    const { filters, updateFilter } = useCompaniesFilters();

    useGetCompaniesQuery(filters);

    const createCompany = () => {
        setCurrentCompanyId(null);
        setCurrentContactId(null);
        setIsCompanyFormOpen(true);
    }

    const editCompany = (companyId) => {
        setCurrentCompanyId(companyId);
        setCurrentContactId(null);
        setIsCompanyFormOpen(true);
    }

    const handleCompanyClose = () => {
        setIsCompanyFormOpen(false);
        setCurrentCompanyId(null);
        setCurrentContactId(null);
    }

    const editContact = (companyId, contactId) => {
        setCurrentCompanyId(companyId);
        setCurrentContactId(contactId);
        setIsContactFormOpen(true);
    }

    const handleContactClose = () => {
        setIsContactFormOpen(false);
        setCurrentCompanyId(null);
        setCurrentContactId(null);
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
                    <Outlet context={{ editCompany, editContact }} />
                </div>
            </div>
            <CompanyForm
                isFormOpen={isCompanyFormOpen}
                onClose={handleCompanyClose}
                companyId={currentCompanyId}
            />
            <ContactForm
                isFormOpen={isContactFormOpen}
                onClose={handleContactClose}
                companyId={currentCompanyId}
                contactId={currentContactId}
            />
        </>
    );
}

export default Companies;
