import '../../../helpers/shared.css';

import NestedSection from '../../ui-components/NestedSection';

function TalentSectionSystemInfo(props) {
    const talent = props.talent;

    return (
        <NestedSection className={`nested-section__system-info ${props.className}`}>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div>
                        Last updated by {talent.updated_by?.name} on {talent.updated_at}.
                        Created by {talent.created_by?.name} on {talent.created_at}.
                    </div>
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionSystemInfo;