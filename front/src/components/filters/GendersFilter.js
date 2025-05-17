import './Filter.css';
import './GendersFilter.css';

import Filter from './Filter';

import { useSettings } from '../../context/SettingsContext';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function GendersFilter(props) {
    const { settings } = useSettings();
    const genders = settings.talent_genders;

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredGenders', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredGenders', JSON.stringify(items));
    }

    let result = null;

    if (genders && Object.keys(genders).length > 0) {
        result = genders.map((gender, index) => {
            return (
                <div
                    className='filter__checkbox-item'
                    key={'filter.genders.' + gender.id}
                    onClick={toggleItem.bind(this, gender.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(gender.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div className='genders-filter__checkbox-name'>{gender.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Gender'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='genders-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default GendersFilter;
