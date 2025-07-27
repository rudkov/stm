import { useSettings } from '../../../context/SettingsContext';
import CheckboxFilter from '../CheckboxFilter';

function PreferencesFilter(props) {
    const { settings } = useSettings();
    const preferences = settings.talent_preferences || [];

    return (
        <CheckboxFilter
            title='Preferences'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={preferences}
            itemKey='system_name'
        />
    );
}

export default PreferencesFilter;
