import NestedSection from '../../NestedSection';

function TalentSectionBiography(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Biography</NestedSection.Header>
            <NestedSection.Body>{talent.biography}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBiography;
