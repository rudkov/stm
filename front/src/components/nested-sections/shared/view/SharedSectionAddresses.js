import NestedSection from '../../NestedSection';

function SharedSectionAddresses(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Addresses</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        data.addresses?.map((address) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`address.` + address.id}>
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

export default SharedSectionAddresses;
