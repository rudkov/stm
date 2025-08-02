import './TalentsFilter.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTalents, fetchTalents } from '../../../store/talents/talents';

import CheckboxFilter from '../CheckboxFilter';
import TalentUsername from '../../talents/components/TalentUsername';

function TalentsFilter(props) {
    const dispatch = useDispatch();
    const talents = useSelector(getTalents);

    useEffect(() => {
        dispatch(fetchTalents());
    }, [dispatch]);

    return (
        <CheckboxFilter
            title='Talents'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={talents}
            isSearchable={true}
            renderItem={(talent) => <TalentUsername className='talents-filter__item' name={talent.name} />}
        />
    );
}

export default TalentsFilter;
