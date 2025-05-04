import './Talents.css';
import '../../helpers/shared.css';

import { Outlet } from 'react-router';

import TalentsList from '../talents/TalentsList';

function Talents() {
    return (
        <div className='talents-page'>
            <TalentsList />
            <div className='talents-page__right-column'>
                <div className='section-primary'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Talents;