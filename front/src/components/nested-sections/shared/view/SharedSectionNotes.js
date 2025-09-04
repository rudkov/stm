import NestedSection from '../../NestedSection';
import { renderParagraphs } from 'helpers/text';

function SharedSectionNotes({ data, className }) {

    if (!data.notes) {
        return null;
    }

    return (
        <NestedSection className={`nested-section__notes ${className}`}>
            <NestedSection.Body>{renderParagraphs(data.notes)}</NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionNotes;
