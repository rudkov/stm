import './Filter.css';
import './SkinColorFilter.css';

import Filter from './Filter';

import { useSettings } from '../../context/SettingsContext';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function SkinColorFilter(props) {
    const { settings } = useSettings();
    const skinColors = settings.talent_skin_colors;

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredSkinColors', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredSkinColors', JSON.stringify(items));
    }

    let result = null;

    if (skinColors && Object.keys(skinColors).length > 0) {
        result = skinColors.map((skinColor, index) => {
            return (
                <div
                    className='filter__checkbox-item'
                    key={'filter.skinColors.' + skinColor.id}
                    onClick={toggleItem.bind(this, skinColor.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(skinColor.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div>{skinColor.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Skin Color'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='skin-color-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default SkinColorFilter;
