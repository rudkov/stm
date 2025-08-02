import './CheckboxFilter.css';

import { useCallback, useState, useEffect, useMemo } from 'react';
import { Input } from 'antd';

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
    isSearchable = false,
    searchFilterFn,
    itemKey = 'id',
    itemValue = 'name',
}) {
    const searchSessionKey = `${uniqueName}.search`;

    const [searchText, setSearchText] = useState(sessionStorage.getItem(searchSessionKey) ?? '');

    useEffect(() => {
        sessionStorage.setItem(searchSessionKey, searchText);
    }, [searchText, searchSessionKey]);

    const filteredData = useMemo(() => {
        if (!searchText) {
            return data;
        }
        const lowerCaseSearchText = searchText.toLowerCase();

        if (searchFilterFn) {
            return data.filter(item => searchFilterFn(item, lowerCaseSearchText));
        }

        return data.filter(item => {
            const value = item[itemValue];
            if (typeof value === 'string' || typeof value === 'number') {
                return String(value).toLowerCase().includes(lowerCaseSearchText);
            }
            return false;
        });
    }, [data, searchText, searchFilterFn, itemValue]);

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
            {isSearchable && (
                <div className='checkbox-filter__search'>
                    <Input
                        placeholder='Search'
                        allowClear
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                </div>
            )}
            <div>
                {filteredData && filteredData.map((item, index) => (
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
