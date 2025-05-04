import NestedSection from '../../ui-components/NestedSection';

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
