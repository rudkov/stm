import 'helpers/shared.css';

/**
 * @param {string} text Input text
 * @return {Array<JSX.Element>|null} Array of React paragraph elements
 */
export function renderParagraphs(text, className = '') {
    if (!text) return null;

    const paragraphs = text.split(/\r\n|\n\r|\r|\n/).filter(paragraph => paragraph.trim() !== '');

    return paragraphs.map((paragraph, index) => (
        <p key={index} className={`p ${className}`}>{paragraph.trim()}</p>
    ));
}
