// import './CompanyView.css';
import '../../helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';

// import { getCompany, fetchCompanyById } from '../../store/contacts/company';

import ScrollableView from '../ui-components/ScrollableView';

function CompanyView(props) {
    // const dispatch = useDispatch();
    // const params = useParams();
    // const company = useSelector(getCompany);
    const scrollContainerRef = useRef(null);
    // const context = useOutletContext();

    // useEffect(() => {
    //     dispatch(fetchCompanyById(params.id));
    // }, [params.id, dispatch]);

    // useEffect(() => {
    //     if (scrollContainerRef.current)
    //         scrollContainerRef.current.scrollTop = 0;
    // }, [company]);

    let result = null;

    // if (company && Object.getPrototypeOf(company) === Object.prototype) {
        result =
            <ScrollableView className='company-profile'>
                <ScrollableView.Header scrollContainerRef={scrollContainerRef}>
                    {/* {company.name} */}
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='company-profile__body'>
                    Hello
                </ScrollableView.Body>
            </ScrollableView>
            ;
    // }

    return result;
}

export default CompanyView;
