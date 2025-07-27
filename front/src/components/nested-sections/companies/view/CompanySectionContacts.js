import './CompanySectionContacts.css';
import '../../../../helpers/shared.css';

import { NavLink } from 'react-router';

import NestedSection from '../../NestedSection';

function CompanySectionContacts({ data, className, inLayout = false }) {
    const company = data;
    const url = inLayout ? '/app/companies/' + company.id + '/' : '/app/contacts/';

    return (
        <NestedSection className={className}>
            <NestedSection.Header>Contacts</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        company.contacts?.map((contact) => {
                            return (
                                <NavLink className='company-section-contacts__contact' to={url + contact.id} key={`company.contact.` + contact.id}>
                                    <div className='company-section-contacts__contact_name'>{contact.first_name} {contact.last_name}</div>
                                    <div className='company-section-contacts__contact_job_title'>{contact.job_title}</div>
                                </NavLink>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default CompanySectionContacts;