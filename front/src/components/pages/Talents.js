import './Talents.css';
import '../../helpers/shared.css';

import { useState } from 'react';
import { Outlet } from 'react-router';

import TalentsList from '../talents/TalentsList';
import TalentForm from '../talents/TalentForm';

function Talents() {
    const [isTalentFormOpen, setIsTalentFormOpen] = useState(false);
    const [isNewTalent, setIsNewTalent] = useState();

    const createTalent = () => {
        setIsNewTalent(true);
        setIsTalentFormOpen(true);
    }

    const editTalent = () => {
        setIsNewTalent(false);
        setIsTalentFormOpen(true);
    }

    const closeTalentForm = () => {
        setIsTalentFormOpen(false);
    }

    return (
        <>
            <div className='talents-page'>
                <TalentsList createTalent={createTalent} />
                <div className='talents-page__right-column'>
                    <div className='section-primary'>
                        <Outlet context={{ editTalent }} />
                    </div>
                </div>
            </div>
            <TalentForm
                open={isTalentFormOpen}
                closeForm={closeTalentForm}
                isNewTalent={isNewTalent}
            />
        </>
    );
}

export default Talents;
