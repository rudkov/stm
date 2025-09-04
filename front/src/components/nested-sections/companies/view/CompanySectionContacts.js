import './CompanySectionContacts.css';
import 'helpers/shared.css';

import { Button } from 'antd';

import NestedSection from '../../NestedSection';

import SharedSectionNotes from '../../shared/view/SharedSectionNotes';

import AddressesList from '../../lists/AddressesList';
import EmailsList from '../../lists/EmailsList';
import MessengersList from '../../lists/MessengersList';
import PhonesList from '../../lists/PhonesList';
import SocialMediaList from '../../lists/SocialMediaList';
import WeblinksList from '../../lists/WeblinksList';

function CompanySectionContacts({ data, className, editContact }) {

    let result = null;
    if (data.contacts?.length > 0) {
        result = (
            data.contacts?.map((contact) => (
                <NestedSection className={className} key={`company.contact.` + contact.id}>
                    <NestedSection.Header className='company-section-contacts__header'>
                        <div className='company-section-contacts__info'>
                            <div className='company-section-contacts__name'>{contact.first_name} {contact.last_name}</div>
                            {(() => {
                                // Determine job title: prefer the one defined in the pivot (contact.companies) for the current company
                                const companySpecificJobTitle = contact.companies?.find(company => company.id === data.id)?.job_title;
                                const jobTitle = companySpecificJobTitle ?? contact.job_title;
                                return (
                                    <div className='company-section-contacts__job_title'>{jobTitle}</div>
                                );
                            })()}
                        </div>
                        <div className='company-section-contacts__buttons'>
                            <Button onClick={() => editContact(data.id, contact.id)}>Edit</Button>
                        </div>
                    </NestedSection.Header>
                    <NestedSection.Body>
                        <div className='nested-section__grid'>
                            <SharedSectionNotes data={contact} />

                            <PhonesList phones={contact.phones} />
                            <EmailsList emails={contact.emails} />
                            <MessengersList messengers={contact.messengers} />

                            {(contact.social_medias?.length > 0 || contact.weblinks?.length > 0) && (
                                <>
                                    <div className='divider' />
                                    <SocialMediaList social_medias={contact.social_medias} />
                                    <WeblinksList weblinks={contact.weblinks} />
                                </>
                            )}

                            {contact.addresses?.length > 0 && (
                                <>
                                    <div className='divider' />
                                    <AddressesList addresses={contact.addresses} />
                                </>
                            )}
                        </div>
                    </NestedSection.Body>
                </NestedSection>
            ))
        );
    }
    else {
        result = (
            <NestedSection className='company-section-contacts__empty'>
                <NestedSection.Body>
                    No contacts found
                </NestedSection.Body>
            </NestedSection>
        );
    }

    return (
        <div>
            <div className='company-section-contacts'>
                {result}
            </div>
        </div>
    );
}

export default CompanySectionContacts;
