import './CompanySectionContacts.css';
import '../../../../helpers/shared.css';

import NestedSection from '../../NestedSection';

function CompanySectionContacts(props) {
    const company = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Contacts</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        company.contacts?.map((contact) => {
                            return (
                                <div className='nested-section__cell' key={`company.contact.` + contact.id}>
                                    <div>{contact.first_name} {contact.last_name}</div>
                                    <div className='text-light'>{contact.job_title}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default CompanySectionContacts;