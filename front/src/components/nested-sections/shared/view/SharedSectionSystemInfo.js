import './SharedSectionSystemInfo.css';
import 'helpers/shared.css';

import NestedSection from '../../NestedSection';

function SharedSectionSystemInfo(props) {
    const data = props.data;

    return (
        <NestedSection className={`shared-section-system-info ${props.className}`}>
            <NestedSection.Body className='shared-section-system-info__body'>
                <div>
                    Created: {data.created_by?.name}, {data.created_at}.
                </div>
                <div>
                    Last updated: {data.updated_by?.name}, {data.updated_at}.
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionSystemInfo;