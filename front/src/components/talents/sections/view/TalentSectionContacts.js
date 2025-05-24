import NestedSection from '../../../ui-components/NestedSection';

import { MessengersIcons } from '../../../ui-components/Icons';

function TalentSectionContacts(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Contacts</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.phones?.map((phone) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.phone.` + phone.id}>
                                    <div className='text-light'>{phone.type?.name}</div>
                                    <div className='ellipsis'>{phone.info}</div>
                                </div>
                            );
                        })
                    }
                    {
                        talent.emails?.map((email) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.email.` + email.id}>
                                    <div className='text-light'>{email.type?.name}</div>
                                    <div className='ellipsis'>{<a href={`mailto:${email.info}`}>{email.info}</a>}</div>
                                </div>
                            );
                        })
                    }
                    {
                        talent.messengers?.map((messenger) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.messenger.` + messenger.id}>
                                    <div className='text-light'>{messenger.type?.name}</div>
                                    <div className='nested-section__item_with_icon ellipsis'>
                                        <div className='nested-section__icon'>{MessengersIcons[messenger.type?.system_name]}</div>
                                        {<a href={`${messenger.type?.url + messenger.info}`} className='ellipsis' target='_blank' rel='noreferrer'>{messenger.info}</a>}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionContacts;
