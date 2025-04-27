import './Filter.css';
import './ManagersFilter.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';

import { getUsers, fetchUsers, filterUsers } from '../../store/users/users';

import Filter from './Filter';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function ManagersFilter(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedUsers = useSelector(getUsers);
    const [managers, setManagers] = useState([]);
    const [query, setQuery] = useState({
        searchString: sessionStorage.getItem('talentsPage.managersFilter.query.searchString') ?? '',
    });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    useEffect(() => {
        setManagers(filterUsers([...fetchedUsers], query));
    }, [fetchedUsers, query]);

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredManagers', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('talentsPage.filteredManagers', JSON.stringify(items));
    }

    const searchManagers = (item) => {
        setQuery({ searchString: item.search });
        sessionStorage.setItem('talentsPage.managersFilter.query.searchString', item.search);
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
            title='Managers'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='managers-filter'>
                <Form
                    form={form}
                    initialValues={{ search: query.searchString }}
                    onValuesChange={searchManagers}
                    autoComplete='off'
                >
                    <Form.Item name='search'>
                        <Input
                            placeholder='Search'
                            allowClear={true}
                        />
                    </Form.Item>
                </Form>
                <div className='managers-filter__managers-list'>
                    {result}
                </div>
            </div>
        </Filter>
    );
}

export default ManagersFilter;
