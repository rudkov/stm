import './Filter.css';
import './EyeColorFilter.css';

import Filter from './Filter';

import { useSettings } from '../../context/SettingsContext';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function EyeColorFilter(props) {
    const { settings } = useSettings();
    const eyeColors = settings.talent_eye_colors;

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredEyeColors', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredEyeColors', JSON.stringify(items));
    }

    let result = null;

    if (eyeColors && Object.keys(eyeColors).length > 0) {
        result = eyeColors.map((eyeColor, index) => {
            return (
                <div
                    className='filter__checkbox-item'
                    key={'filter.eyeColors.' + eyeColor.id}
                    onClick={toggleItem.bind(this, eyeColor.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(eyeColor.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div>{eyeColor.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Eye Color'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='eye-color-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default EyeColorFilter;
