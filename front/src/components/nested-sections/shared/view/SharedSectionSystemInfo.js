import '../../../../helpers/shared.css';

import NestedSection from '../../NestedSection';

function SharedSectionSystemInfo(props) {
    const data = props.data;

    return (
        <NestedSection className={`nested-section__system-info ${props.className}`}>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div>
                        Last updated by {data.updated_by?.name} on {data.updated_at}.
                        Created by {data.created_by?.name} on {data.created_at}.
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionSystemInfo;