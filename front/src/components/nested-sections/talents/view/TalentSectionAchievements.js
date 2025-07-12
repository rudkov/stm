import NestedSection from '../../NestedSection';

function TalentSectionAchievements(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Achievements</NestedSection.Header>
            <NestedSection.Body>{talent.achievements}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionAchievements;
