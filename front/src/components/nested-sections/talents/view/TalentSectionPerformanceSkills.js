import NestedSection from '../../NestedSection';
import { renderParagraphs } from 'helpers/text';

function TalentSectionPerformanceSkills(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Performance Skills</NestedSection.Header>
            <NestedSection.Body>{renderParagraphs(talent.performance_skills)}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPerformanceSkills;
