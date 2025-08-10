import './TalentsFilter.css';

import { useGetTalentsQuery } from 'api/talents/talentsApi';

import CheckboxFilter from '../CheckboxFilter';

import TalentUsername from 'components/talents/components/TalentUsername';

function TalentsFilter(props) {
    const { data: talents } = useGetTalentsQuery();

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
