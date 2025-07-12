import NestedSection from '../../NestedSection';

import { MessengersIcons } from '../../../ui-components/Icons';

function SharedSectionContacts(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Contacts</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        data.phones?.map((phone) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`phone.` + phone.id}>
                                    <div className='text-light'>{phone.type?.name}</div>
                                    <div className='ellipsis'>{<a href={`tel:${phone.info}`}>{phone.info}</a>}</div>
                                </div>
                            );
                        })
                    }
                    {
                        data.emails?.map((email) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`email.` + email.id}>
                                    <div className='text-light'>{email.type?.name}</div>
                                    <div className='ellipsis'>{<a href={`mailto:${email.info}`}>{email.info}</a>}</div>
                                </div>
                            );
                        })
                    }
                    {
                        data.messengers?.map((messenger) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`messenger.` + messenger.id}>
                                    <div className='text-light'>{messenger.type?.name}</div>
                                    <div className='nested-section__item_with_icon ellipsis'>
                                        <div className='nested-section__icon'>{MessengersIcons[messenger.type?.system_name]}</div>
                                        {messenger.type?.url ? (
                                            <a href={`${messenger.type.url}${messenger.info}`} className='ellipsis' target='_blank' rel='noreferrer'>
                                                {messenger.info}
                                            </a>
                                        ) : (
                                            <span className='ellipsis'>{messenger.info}</span>
                                        )}
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

export default SharedSectionContacts;
