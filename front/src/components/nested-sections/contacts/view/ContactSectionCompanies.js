import './ContactSectionCompanies.css';
import 'helpers/shared.css';

import { NavLink } from 'react-router';

import NestedSection from '../../NestedSection';

function ContactSectionCompanies({ data, className }) {
    const contact = data;

    return (
        <NestedSection className={className}>
            <NestedSection.Header>Companies</NestedSection.Header>
            <NestedSection.Body className='contact-section-companies__body'>
                <div className='nested-section__grid contact-section-companies__grid'>
                    {
                        contact.companies?.map((company) => {
                            return (
                                <NavLink className='contact-section-companies__company' to={'/app/companies/' + company.id} key={`contact.company.` + company.id}>
                                    <div className='contact-section-companies__company-name'>{company.name}</div>
                                    <div className='contact-section-companies__company-job-title'>{company.job_title}</div>
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