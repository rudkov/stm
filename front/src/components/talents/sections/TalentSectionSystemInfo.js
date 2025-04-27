import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { getTalent } from '../../../store/talents/talent';
import DataCell from '../../ui-components/DataCell';

function TalentSectionSystemInfo() {
    const talent = useSelector(getTalent);

    return (
        <div className='info-panel--section info-panel--system-info'>
            <div className='info-panel--section_2col text-regular'>
                <DataCell
                    label='Updated'
                    value={talent.updated_by?.name + ' · ' + talent.updated_at}
                />
                <DataCell
                    label='Created'
                    value={talent.created_by?.name + ' · ' + talent.created_at}
                />
            </div>
        </div>
    );
}

export default TalentSectionSystemInfo;