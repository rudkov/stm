import NestedSection from '../../NestedSection';

function SharedSectionNotes(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Notes</NestedSection.Header>
            <NestedSection.Body>{data.notes}</NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionNotes;