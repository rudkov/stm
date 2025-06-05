import './Talents.css';
import '../../helpers/shared.css';

import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router';

import { fetchTalents } from '../../store/talents/talents';
import { useTalentsFilters, TalentsFilters } from '../talents/TalentsFilters';

import TalentsList from '../talents/TalentsList';
import TalentForm from '../talents/TalentForm';

function Talents() {
    const dispatch = useDispatch();
    const [isTalentFormOpen, setIsTalentFormOpen] = useState(false);
    const [isNewTalent, setIsNewTalent] = useState();
    const { filters, updateFilter } = useTalentsFilters();

    // Memoized function to fetch talents with current filters
    const fetchTalentsWithFilters = useCallback(() => {
        dispatch(fetchTalents(filters));
    }, [dispatch, filters]);

    // Fetch talents when filters change
    useEffect(() => {
        fetchTalentsWithFilters();
    }, [fetchTalentsWithFilters]);

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
                onAfterSubmit={fetchTalentsWithFilters}
            />
        </>
    );
}

export default Talents;
