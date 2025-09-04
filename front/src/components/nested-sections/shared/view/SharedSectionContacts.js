import NestedSection from '../../NestedSection';

import EmailsList from '../../lists/EmailsList';
import MessengersList from '../../lists/MessengersList';
import PhonesList from '../../lists/PhonesList';

function SharedSectionContacts(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Contacts</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <EmailsList emails={data.emails} />
                    <MessengersList messengers={data.messengers} />
                    <PhonesList phones={data.phones} />
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionContacts;
