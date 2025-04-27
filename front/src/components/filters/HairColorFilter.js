import './Filter.css';
import './HairColorFilter.css';

import Filter from './Filter';

import { useSettings } from '../../context/SettingsContext';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function HairColorFilter(props) {
    const { settings } = useSettings();
    const hairColors = settings.talent_hair_colors;

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredHairColors', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredHairColors', JSON.stringify(items));
    }

    let result = null;

    if (hairColors && Object.keys(hairColors).length > 0) {
        result = hairColors.map((hairColor, index) => {
            return (
                <div
                    className='filter__checkbox-item'
                    key={'filter.hairColors.' + hairColor.id}
                    onClick={toggleItem.bind(this, hairColor.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(hairColor.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div>{hairColor.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Hair Colors'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='hair-color-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default HairColorFilter;
