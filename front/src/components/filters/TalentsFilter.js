import './Filter.css';
import './TalentsFilter.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';

import { getTalents, fetchTalents, filterTalents } from '../../store/talents/talents';

import Filter from './Filter';
import TalentUsername from '../talents/components/TalentUsername';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function TalentsFilter(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedTalents = useSelector(getTalents);
    const [talents, setTalents] = useState([]);
    const [query, setQuery] = useState({
        searchString: sessionStorage.getItem('eventsPage.talentsFilter.query.searchString') ?? '',
    });

    useEffect(() => {
        dispatch(fetchTalents());
    }, [dispatch]);

    useEffect(() => {
        setTalents(filterTalents([...fetchedTalents], query));
    }, [fetchedTalents, query]);

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredTalents', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredTalents', JSON.stringify(items));
    }

    const searchTalents = (item) => {
        setQuery({ searchString: item.search });
        sessionStorage.setItem('eventsPage.talentsFilter.query.searchString', item.search);
    }

    let result = null;

    if (talents && Object.keys(talents).length > 0) {
        result = talents.map((talent, index) => {
            return (
                <div
                    className='filter__checkbox-item talents-filter__checkbox-item'
                    key={'filter.talents.' + talent.id}
                    onClick={toggleItem.bind(this, talent.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(talent.id)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <TalentUsername name={talent.name} />
                </div>
            );
        });
    }

    return (
        <Filter
            title='Talents'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='talents-filter'>
                <Form
                    form={form}
                    initialValues={{ search: query.searchString }}
                    onValuesChange={searchTalents}
                    autoComplete='off'
                >
                    <Form.Item name='search'>
                        <Input
                            placeholder='Search'
                            allowClear={true}
                        />
                    </Form.Item>
                </Form>
                <div className='talents-filter__talents-list'>
                    {result}
                </div>
            </div>
        </Filter>
    );
}

export default TalentsFilter;
