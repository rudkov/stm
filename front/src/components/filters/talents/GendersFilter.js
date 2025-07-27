import { useSettings } from '../../../context/SettingsContext';
import CheckboxFilter from '../CheckboxFilter';

function GendersFilter(props) {
    const { settings } = useSettings();
    const genders = settings.talent_genders || [];

    return (
        <CheckboxFilter
            title='Gender'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={genders}
        />
    );
}

export default GendersFilter;
