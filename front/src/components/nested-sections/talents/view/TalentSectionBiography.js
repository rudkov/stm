import NestedSection from '../../NestedSection';
import { renderParagraphs } from 'helpers/text';

function TalentSectionBiography(props) {
    const talent = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Biography</NestedSection.Header>
            <NestedSection.Body>{renderParagraphs(talent.biography)}</NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionBiography;
