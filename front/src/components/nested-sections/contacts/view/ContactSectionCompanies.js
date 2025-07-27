import './ContactSectionCompanies.css';
import '../../../../helpers/shared.css';

import { NavLink } from 'react-router';

import NestedSection from '../../NestedSection';

function ContactSectionCompanies({ data, className, inLayout = false }) {
    const contact = data;
    const url = inLayout ? '/app/contacts/' + contact.id + '/' : '/app/companies/';

    return (
        <NestedSection className={className}>
            <NestedSection.Header>Companies</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        contact.companies?.map((company) => {
                            return (
                                <NavLink className='contact-section-companies__company' to={url + company.id} key={`contact.company.` + company.id}>
                                    <div className='contact-section-companies__company_name'>{company.name}</div>
                                    <div className='contact-section-companies__company_categories'>Category 1, Category 2, Category 3</div>
                                </NavLink>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default ContactSectionCompanies;