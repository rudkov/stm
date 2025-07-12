import NestedSection from '../../NestedSection';

function TalentSectionAddresses(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Addresses</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.addresses?.map((address) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.address.` + address.id}>
                                    <div className='text-light'>{address.type?.name}</div>
                                    <div>{address.info}</div>
                                </div>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionAddresses;
