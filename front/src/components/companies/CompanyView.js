import './CompanyView.css';
import 'helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useEffect, useRef } from 'react';

import { useGetCompanyQuery } from 'api/companies/companiesApi';

import ScrollableView from 'components/ui-components/ScrollableView';

import SharedSectionNotes from 'components/nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSystemInfo from 'components/nested-sections/shared/view/SharedSectionSystemInfo';

import CompanySectionPrimaryInfo from 'components/nested-sections/companies/view/CompanySectionPrimaryInfo';
import CompanySectionContacts from 'components/nested-sections/companies/view/CompanySectionContacts';
import CompanySectionMain from 'components/nested-sections/companies/view/CompanySectionMain';

function CompanyView() {
    const params = useParams();
    const scrollContainerRef = useRef(null);
    const context = useOutletContext();

    const { data: company } = useGetCompanyQuery({ id: params.companyId }, { skip: !params.companyId });

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [company]);

    let result = null;

    if (company) {
        result =
            <ScrollableView className='section-primary'>
                <ScrollableView.Header scrollContainerRef={scrollContainerRef}>
                    <CompanySectionMain
                        data={company}
                        editCompany={context?.editCompany}
                        editContact={context?.editContact}
                    />
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='company-view-layout'>

                    <SharedSectionNotes data={company} className='company-section__notes' />

                    <div className='company-view-layout__content'>
                        <CompanySectionPrimaryInfo data={company} className='company-section__primary-info' />
                        <CompanySectionContacts data={company} editContact={context?.editContact} className='company-section__contacts' />
                    </div>

                    <SharedSectionSystemInfo data={company} className='company-section__system-info' />

                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default CompanyView;
