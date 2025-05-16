import './TalentsList.css';
import '../../helpers/shared.css';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Form, Input, Tooltip, Button } from 'antd';

import { getTalents, fetchTalents, filterTalents } from '../../store/talents/talents';

import ScrollableView from '../ui-components/ScrollableView';

import TalentUsername from './components/TalentUsername';

import InTownFilter from '../filters/InTownFilter';

import { ReactComponent as IconInTown } from '../../assets/icons/in-town.svg';
import { ReactComponent as IconAdd } from '../../assets/icons/add.svg';

function TalentsList(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedTalents = useSelector(getTalents);
    const [talents, setTalents] = useState([]);
    const scrollContainerRef = useRef(null);

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
            <ScrollableView>
                <ScrollableView.Body className='talents-container__filters'>
                    <InTownFilter
                        uniqueName='talentsPage.inTownFilter'
                        selectedItem={query.inTownOnly}
                        setFiltered={setInTownOnly}
                    />
                </ScrollableView.Body>
            </ScrollableView>
            <div className='talents-container__list'>
                <ScrollableView scrollContainerRef={scrollContainerRef} className='talents-container__list-section section-primary'>
                    <ScrollableView.Header className='talents-list__header'>
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
                        <Button type='primary' icon={<IconAdd />} onClick={props.createTalent} />
                    </ScrollableView.Header>
                    <ScrollableView.Body className='talents-list__body'>
                        {result}
                    </ScrollableView.Body>
                </ScrollableView>
            </div>
        </div>
    );
}

export default TalentsList;
