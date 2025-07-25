import '../Filter.css';
import './PreferencesFilter.css';

import { useSettings } from '../../../context/SettingsContext';

import Filter from '../Filter';

import { ReactComponent as IconCheckSmall } from '../../../assets/icons/check-small.svg';

function PreferencesFilter(props) {
    const { settings } = useSettings();

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(items));
    }

    return (
        <Filter
            title='Preferences'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='preferences-filter'>
                {
                    settings.talent_preferences.map((preference, index) => {
                        return (
                            <div
                                className='filter__checkbox-item preferences-filter__checkbox-item'
                                key={'filter.preferences.' + preference.system_name}
                                onClick={toggleItem.bind(this, preference.system_name)}
                            >
                                <div className='filter__checkbox'>
                                    {
                                        props.selectedItems?.includes(preference.system_name)
                                            ? <div className='filter__check'><IconCheckSmall /></div>
                                            : ''
                                    }
                                </div>
                                <div className='preferences-filter__checkbox-name'>{preference.name}</div>
                            </div>
                        );
                    })
                }
            </div>
        </Filter>
    );
}

export default PreferencesFilter;
