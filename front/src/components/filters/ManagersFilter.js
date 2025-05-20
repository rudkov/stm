import './Filter.css';
import './ManagersFilter.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUsers, fetchUsers } from '../../store/users/users';

import Filter from './Filter';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function ManagersFilter(props) {
    const dispatch = useDispatch();
    const fetchedUsers = useSelector(getUsers);
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        setManagers([...fetchedUsers]);
    }, [fetchedUsers]);

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

    let result = null;

    if (managers && Object.keys(managers).length > 0) {
        result = managers.map((manager, index) => {
            return (
                <div
                    className='filter__checkbox-item managers-filter__checkbox-item'
                    key={'filter.managers.' + manager.id}
                    onClick={toggleItem.bind(this, manager.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(manager.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div className='managers-filter__checkbox-name'>{manager.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Manager'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='managers-filter'>
                {result}
            </div>
        </Filter>
    );
}

export default ManagersFilter;
