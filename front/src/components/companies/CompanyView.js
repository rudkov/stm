import './CompanyView.css';
import '../../helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import { getCompany, fetchCompany } from '../../store/companies/company';

import ScrollableView from '../ui-components/ScrollableView';

import SharedSectionAddresses from '../nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from '../nested-sections/shared/view/SharedSectionSystemInfo';

import CompanySectionContacts from '../nested-sections/companies/view/CompanySectionContacts';
import CompanySectionMain from '../nested-sections/companies/view/CompanySectionMain';

function CompanyView({ inLayout = false }) {
    const dispatch = useDispatch();
    const params = useParams();
    const company = useSelector(getCompany);
    const scrollContainerRef = useRef(null);
    const context = useOutletContext();

    useEffect(() => {
        dispatch(fetchCompany({ id: params.companyId }));
    }, [dispatch, params.companyId]);

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [company]);

    let result = null;

    if (company && Object.getPrototypeOf(company) === Object.prototype) {
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
