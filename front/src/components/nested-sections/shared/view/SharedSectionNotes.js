import NestedSection from '../../NestedSection';
import { renderParagraphs } from 'helpers/text';

function SharedSectionNotes(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Notes</NestedSection.Header>
            <NestedSection.Body>{renderParagraphs(data.notes)}</NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionNotes;
