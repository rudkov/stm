import './Talents.css';
import '../../helpers/shared.css';

import { Outlet } from 'react-router';

import TalentsList from '../talents/TalentsList';

function Talents() {
    return (
        <div className='talents-page'>
            <TalentsList />
            <div className='talent-profile'>
                <div className='section-primary'>
                    <div className='scrollbar-y'>
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Talents;