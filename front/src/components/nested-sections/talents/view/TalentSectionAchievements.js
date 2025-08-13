import NestedSection from '../../NestedSection';
import { renderParagraphs } from 'helpers/text';

function TalentSectionAchievements(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Achievements</NestedSection.Header>
            <NestedSection.Body>{renderParagraphs(talent.achievements)}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionAchievements;
