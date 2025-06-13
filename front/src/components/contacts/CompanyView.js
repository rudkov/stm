// import './CompanyView.css';
import '../../helpers/shared.css';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

import { getCompany, fetchCompanyById } from '../../store/contacts/company';

import ScrollableView from '../ui-components/ScrollableView';

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
                    {company?.contacts?.map((contact) => (
                        <div key={contact.id}>
                            {contact.first_name} {contact.last_name} <br />
                            {contact.job_title}
                        </div>
                    ))}
                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default CompanyView;
