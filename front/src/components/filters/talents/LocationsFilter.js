import { useGetTalentLocationsQuery } from 'api/talents/talentsApi';
import CheckboxFilter from '../CheckboxFilter';

function LocationsFilter(props) {
    const { data: locations } = useGetTalentLocationsQuery();

    return (
        <CheckboxFilter
            title='Location'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={locations}
        />
    );
}

export default LocationsFilter;
