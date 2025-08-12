import NestedSection from '../../NestedSection';

function TalentSectionEmergencyContacts(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Relatives & Emergency Contacts</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.emergency_contacts?.map((emergency_contact) => {
                            return (
                                <div className='nested-section__cell' key={`talent.emergency-contact.` + emergency_contact.id}>
                                    <div>{emergency_contact.info}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionEmergencyContacts;
