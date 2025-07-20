import './Talents.css';
import '../../helpers/shared.css';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchTalents, fetchTalentsManagers } from '../../store/talents/talents';
import { useTalentsFilters, TalentsFilters } from '../talents/TalentsFilters';

import TalentsList from '../talents/TalentsList';
import TalentForm from '../talents/TalentForm';

function Talents() {
    const dispatch = useDispatch();
    const [isTalentFormOpen, setIsTalentFormOpen] = useState(false);
    const [isNewTalent, setIsNewTalent] = useState();
    const [currentTalentId, setCurrentTalentId] = useState(null);
    const { filters, updateFilter } = useTalentsFilters();

    // Fetch talents when filters change (only filtered results)
    useEffect(() => {
        dispatch(fetchTalents(filters));
    }, [dispatch, filters]);

    // Fetch managers once on component mount
    useEffect(() => {
        dispatch(fetchTalentsManagers());
    }, [dispatch]);

    // Function to call both API endpoints after talent save/update
    const fetchAfterSaveOrUpdate = useCallback(() => {
        dispatch(fetchTalents(filters));
        dispatch(fetchTalentsManagers());
    }, [dispatch, filters]);

    const createTalent = () => {
        setIsNewTalent(true);
        setCurrentTalentId(null);
        setIsTalentFormOpen(true);
    }

    const editTalent = (id) => {
        setIsNewTalent(false);
        setCurrentTalentId(id);
        setIsTalentFormOpen(true);
    }

    const closeTalentForm = () => {
        setIsTalentFormOpen(false);
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
                open={isTalentFormOpen}
                closeForm={closeTalentForm}
                isNewTalent={isNewTalent}
                talentId={currentTalentId}
                onAfterSubmit={fetchAfterSaveOrUpdate}
            />
        </>
    );
}

export default Talents;
