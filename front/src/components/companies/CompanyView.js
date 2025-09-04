import './CompanyView.css';
import 'helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useEffect, useRef } from 'react';

import { useGetCompanyQuery } from 'api/companies/companiesApi';

import ScrollableView from 'components/ui-components/ScrollableView';

import SharedSectionAddresses from 'components/nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from 'components/nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from 'components/nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from 'components/nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from 'components/nested-sections/shared/view/SharedSectionSystemInfo';

import CompanySectionContacts from 'components/nested-sections/companies/view/CompanySectionContacts';
import CompanySectionMain from 'components/nested-sections/companies/view/CompanySectionMain';

function CompanyView({ inLayout = false }) {
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
                    <CompanySectionMain data={company} editAction={context?.editCompany} />
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='company-view__body'>

                    <SharedSectionNotes data={company} className='company-section__notes' />
                    <SharedSectionContacts data={company} className='company-section__contacts' />
                    <CompanySectionContacts data={company} inLayout={inLayout} className='company-section__contacts' />
                    <SharedSectionAddresses data={company} className='company-section__addresses' />
                    <SharedSectionSocialMedia data={company} className='company-section__social-media' />
                    <SharedSectionSystemInfo data={company} className='company-section__system-info' />

                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default CompanyView;
