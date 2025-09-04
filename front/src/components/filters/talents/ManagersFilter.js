import { useGetTalentManagersQuery } from 'api/talents/talentsApi';
import CheckboxFilter from '../CheckboxFilter';

function ManagersFilter(props) {
    const { data: managers } = useGetTalentManagersQuery();

    return (
        <CheckboxFilter
            title='Manager'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={managers}
        />
    );
}

export default ManagersFilter;
