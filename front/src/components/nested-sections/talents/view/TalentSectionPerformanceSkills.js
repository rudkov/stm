import NestedSection from '../../NestedSection';

function TalentSectionPerformanceSkills(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Performance Skills</NestedSection.Header>
            <NestedSection.Body>{talent.performance_skills}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPerformanceSkills;
