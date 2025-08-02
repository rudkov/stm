import { useCallback } from 'react';
import { useSettings } from '../../../context/SettingsContext';
import { useTheme } from '../../../context/ThemeContext';

import CheckboxFilter from '../CheckboxFilter';

function TypesFilter(props) {
    const { settings } = useSettings();
    const { theme } = useTheme();
    const types = settings.event_types || [];

    const getCheckboxStyle = useCallback((type) => {
        const color = theme === 'light' ? type.color_light_theme : type.color_dark_theme;
        return { backgroundColor: color };
    }, [theme]);

    return (
        <CheckboxFilter
            title='Types'
            uniqueName={props.uniqueName}
            selectedItems={props.selectedItems}
            setFiltered={props.setFiltered}
            data={types}
            getCheckboxStyle={getCheckboxStyle}
        />
    );
}

export default TypesFilter;
