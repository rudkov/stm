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

                    <h4>Notes</h4>
                    <div>{company.notes}</div>

                    <h4>Category</h4>
                    <div>
                        <div>Category 1</div>
                        <div>Category 2</div>
                        <div>Category 3</div>
                    </div>

                    <h4>Contacts</h4>
                    {company?.contacts?.map((contact) => (
                        <div key={contact.id}>
                            {contact.first_name} {contact.last_name} – {contact.job_title}
                        </div>
                    ))}

                    <h4>Addresses</h4>
                    {company?.addresses?.map((address) => (
                        <div key={address.id}>
                            {address.type?.name} – {address.info}
                        </div>
                    ))}

                    <h4>Emails</h4>
                    {company?.emails?.map((email) => (
                        <div key={email.id}>
                            {email.type?.name} – {email.info}
                        </div>
                    ))}

                    <h4>Phones</h4>
                    {company?.phones?.map((phone) => (
                        <div key={phone.id}>
                            {phone.type?.name} – {phone.info}
                        </div>
                    ))}

                    <h4>Messengers</h4>
                    {company?.messengers?.map((messenger) => (
                        <div key={messenger.id}>
                            {messenger.type.name} – {messenger.info}
                        </div>
                    ))}

                    <h4>Social Media</h4>
                    {company?.social_medias?.map((social_media) => (
                        <div key={social_media.id}>
                            {social_media.type.name} – {social_media.info}
                        </div>
                    ))}

                    <h4>Weblinks</h4>
                    {company?.weblinks?.map((weblink) => (
                        <div key={weblink.id}>
                            {weblink.info}
                        </div>
                    ))}

                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default CompanyView;
