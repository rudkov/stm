import NestedSection from '../../NestedSection';

import AddressesList from '../../lists/AddressesList';

function SharedSectionAddresses(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Addresses</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <AddressesList addresses={data.addresses} />
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionAddresses;
