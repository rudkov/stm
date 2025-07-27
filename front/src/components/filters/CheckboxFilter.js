import './CheckboxFilter.css';

import { useCallback } from 'react';

import Filter from './Filter';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function CheckboxFilter({
    title,
    uniqueName,
    selectedItems,
    setFiltered,
    data,
    renderItem,
    getCheckboxStyle,
    itemKey = 'id',
    itemValue = 'name',
}) {
    const toggleItem = (item) => {
        const value = item[itemKey];

        const newItems = selectedItems.includes(value)
            ? selectedItems.filter(id => id !== value)
            : [...selectedItems, value];

        setFiltered(newItems);
        sessionStorage.setItem(uniqueName, JSON.stringify(newItems));
    };

    const clearFilter = useCallback(() => {
        const items = [];
        setFiltered(items);
        sessionStorage.setItem(uniqueName, JSON.stringify(items));
    }, [setFiltered, uniqueName]);

    return (
        <Filter
            title={title}
            uniqueName={uniqueName}
            applied={selectedItems && selectedItems.length > 0}
            clearFilter={clearFilter}
        >
            <div>
                {data && data.map((item, index) => (
                    <div
                        className='checkbox-filter__item'
                        key={`${uniqueName}.${index}`}
                        onClick={() => toggleItem(item)}
                    >
                        <div
                            className='checkbox-filter__checkbox'
                            style={getCheckboxStyle ? getCheckboxStyle(item) : {}}
                        >
                            {selectedItems?.includes(item[itemKey]) && (
                                <div className='checkbox-filter__check'><IconCheckSmall /></div>
                            )}
                        </div>
                        {renderItem ? (
                            renderItem(item)
                        ) : (
                            <div className='checkbox-filter__value'>{item[itemValue]}</div>
                        )}
                    </div>
                ))}
            </div>
        </Filter>
    );
}

export default CheckboxFilter; 
