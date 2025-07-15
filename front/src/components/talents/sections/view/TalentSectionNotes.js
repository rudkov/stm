import NestedSection from '../../../ui-components/NestedSection';

function TalentSectionNotes(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Notes</NestedSection.Header>
            <NestedSection.Body>{talent.notes}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionNotes;