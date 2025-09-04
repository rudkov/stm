import './Talents.css';
import '../../helpers/shared.css';

import { useState } from 'react';
import { Outlet } from 'react-router';

import { useGetTalentsQuery, useGetTalentManagersQuery } from 'api/talents/talentsApi';
import { useTalentsFilters, TalentsFilters } from '../talents/TalentsFilters';

import TalentsList from '../talents/TalentsList';
import TalentForm from '../talents/TalentForm';

function Talents() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [currentTalentId, setCurrentTalentId] = useState(null);
    const { filters, updateFilter } = useTalentsFilters();

    useGetTalentsQuery(filters);
    useGetTalentManagersQuery();

    const createTalent = () => {
        setCurrentTalentId(null);
        setIsFormOpen(true);
    }

    const editTalent = (id) => {
        setCurrentTalentId(id);
        setIsFormOpen(true);
    }

    const handleClose = () => {
        setIsFormOpen(false);
        setCurrentTalentId(null);
    }

    return (
        <>
            <div className='talents-page'>
                <TalentsFilters
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <TalentsList
                    createTalent={createTalent}
                    filters={filters}
                    updateFilter={updateFilter}
                />
                <div className='talents-page__right-column'>
                    <div className='section-primary'>
                        <Outlet context={{ editTalent }} />
                    </div>
                </div>
            </div>
            <TalentForm
                isFormOpen={isFormOpen}
                onClose={handleClose}
                talentId={currentTalentId}
            />
        </>
    );
}

export default Talents;
