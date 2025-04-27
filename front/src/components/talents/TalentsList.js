import './TalentsList.css';
import '../../helpers/shared.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Form, Input, Tooltip, Button } from 'antd';

import { getTalents, fetchTalents, filterTalents } from '../../store/talents/talents';

import TalentUsername from './components/TalentUsername';

import InTownFilter from '../filters/InTownFilter';

import { ReactComponent as IconInTown } from '../../assets/icons/in-town-16.svg';
import { ReactComponent as IconAdd } from '../../assets/icons/add.svg';

function TalentsList() {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedTalents = useSelector(getTalents);
    const [talents, setTalents] = useState([]);

    const [query, setQuery] = useState({
        searchString: sessionStorage.getItem('talentsPage.talentsList.query.searchString') ?? '',
        inTownOnly: JSON.parse(sessionStorage.getItem('talentsPage.talentsList.query.inTownOnly')) ?? false,
    });

    useEffect(() => {
        dispatch(fetchTalents());
    }, [dispatch]);

    useEffect(() => {
        setTalents(filterTalents([...fetchedTalents], query));
    }, [fetchedTalents, query]);

    const searchTalents = (item) => {
        setQuery({
            searchString: item.search,
            inTownOnly: query.inTownOnly,
        });
        sessionStorage.setItem('talentsPage.talentsList.query.searchString', item.search);
    }

    const setInTownOnly = (item) => {
        setQuery({
            searchString: query.searchString,
            inTownOnly: item,
        });
        sessionStorage.setItem('talentsPage.talentsList.query.inTownOnly', item);
    }

    let result = null;

    if (talents && Object.keys(talents).length > 0) {
        result = talents.map((talent, index) => {
            return (
                <NavLink className='talents-list__item' key={'talent.' + talent.id} to={talent.id}>
                    <TalentUsername name={talent.name} />
                    <div className='talents-list-item__in-town'>
                        {
                            talent.location
                                ? ''
                                :
                                <Tooltip title='In town' placement='bottom' arrow={false} mouseEnterDelay={0.5}>
                                    <IconInTown />
                                </Tooltip>
                        }
                    </div>
                </NavLink>
            );
        });
    }

    return (
        <div className='talents-container'>
            <div className='talents-container__filters scrollbar-y'>
                <InTownFilter
                    uniqueName='talentsPage.inTownFilter'
                    selectedItem={query.inTownOnly}
                    setFiltered={setInTownOnly}
                />
            </div>
            <div className='talents-container__list'>
                <div className='talents-container__list-section section-primary'>
                    <div className='talents-list__header'>
                        <Form
                            form={form}
                            name='talents.search.form'
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
                        <NavLink to='new'>
                            <Button type='primary' icon={<IconAdd />} />
                        </NavLink>
                    </div>
                    <div className='scrollbar-y'>
                        {result}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TalentsList;
