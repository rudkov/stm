// import './CompanyView.css';
import '../../helpers/shared.css';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import { getCompany, fetchCompanyById } from '../../store/contacts/company';

import ScrollableView from '../ui-components/ScrollableView';

import SharedSectionAddresses from '../nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from '../nested-sections/shared/view/SharedSectionSystemInfo';

import CompanySectionContacts from '../nested-sections/companies/view/CompanySectionContacts';

function CompanyView() {
    const dispatch = useDispatch();
    const params = useParams();
    const company = useSelector(getCompany);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        dispatch(fetchCompanyById(params.id));
    }, [params.id, dispatch]);

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [company]);

    let result = null;

    if (company && Object.getPrototypeOf(company) === Object.prototype) {
        result =
            <ScrollableView className='company-profile'>
                <ScrollableView.Header scrollContainerRef={scrollContainerRef}>
                    <h3>{company.name}</h3>
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='company-profile__body'>
                    <h4>Category</h4>
                    <div>
                        <div>Category 1</div>
                        <div>Category 2</div>
                        <div>Category 3</div>
                    </div>

                    <SharedSectionNotes data={company} className='company-section__notes' />
                    <SharedSectionContacts data={company} className='company-section__contacts' />
                    <CompanySectionContacts data={company} className='company-section__contacts' />
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
