import NestedSection from '../../ui-components/NestedSection';

function TalentSectionBiography(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Biography</NestedSection.Header>
            <NestedSection.Body>{talent.biography}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBiography;
