import './TalentsList.css';
import '../../helpers/shared.css';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Form, Input, Tooltip, Button } from 'antd';

import { getTalents, fetchTalents, filterTalents } from '../../store/talents/talents';

import ScrollableView from '../ui-components/ScrollableView';

import TalentUsername from './components/TalentUsername';

import BodyFilter from '../filters/BodyFilter';
import GendersFilter from '../filters/GendersFilter';
import LocationsFilter from '../filters/LocationsFilter';
import ManagersFilter from '../filters/ManagersFilter';
import NoContactsFilter from '../filters/NoContactsFilter';
import PreferencesFilter from '../filters/PreferencesFilter';

import { ReactComponent as IconInTown } from '../../assets/icons/in-town.svg';
import { ReactComponent as IconAdd } from '../../assets/icons/add.svg';

function TalentsList(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedTalents = useSelector(getTalents);
    const [talents, setTalents] = useState([]);
    const scrollContainerRef = useRef(null);

    const filterNames = {
        body: 'talents.filters.body',
        genders: 'talents.filters.genders',
        locations: 'talents.filters.locations',
        managers: 'talents.filters.managers',
        noContacts: 'talents.filters.noContacts',
        preferences: 'talents.filters.preferences',
    };

    const [searchString, setSearchString] = useState(sessionStorage.getItem('talents.list.search') ?? '');

    const [bodyFilter, setBodyFilter] = useState(JSON.parse(sessionStorage.getItem(filterNames.body)) ?? []);
    const [gendersFilter, setGendersFilter] = useState(JSON.parse(sessionStorage.getItem(filterNames.genders)) ?? []);
    const [locationsFilter, setLocationsFilter] = useState(JSON.parse(sessionStorage.getItem(filterNames.locations)) ?? []);
    const [managersFilter, setManagersFilter] = useState(JSON.parse(sessionStorage.getItem(filterNames.managers)) ?? []);
    const [noContactsFilter, setNoContactsFilter] = useState(JSON.parse(sessionStorage.getItem(filterNames.noContacts)) ?? false);
    const [preferencesFilter, setPreferencesFilter] = useState(JSON.parse(sessionStorage.getItem(filterNames.preferences)) ?? []);

    useEffect(() => {
        dispatch(fetchTalents({
            body: bodyFilter,
            genders: gendersFilter,
            noContacts: noContactsFilter,
            preferences: preferencesFilter,
        }));
    }, [
        dispatch,
        bodyFilter,
        gendersFilter,
        noContactsFilter,
        preferencesFilter,
    ]);

    useEffect(() => {
        setTalents(
            filterTalents(
                [...fetchedTalents],
                {
                    searchString,
                    locations: locationsFilter,
                    managers: managersFilter
                }
            )
        );
    }, [fetchedTalents, searchString, locationsFilter, managersFilter]);

    const searchTalents = (item) => {
        setSearchString(item.search);
        sessionStorage.setItem('talents.list.search', item.search);
    }

    let result = null;

    if (talents && Object.keys(talents).length > 0) {
        result = talents.map((talent) => {
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
                    <LocationsFilter
                        uniqueName={filterNames.locations}
                        selectedItems={locationsFilter}
                        setFiltered={setLocationsFilter}
                    />
                    <ManagersFilter
                        uniqueName={filterNames.managers}
                        selectedItems={managersFilter}
                        setFiltered={setManagersFilter}
                    />
                    <GendersFilter
                        uniqueName={filterNames.genders}
                        selectedItems={gendersFilter}
                        setFiltered={setGendersFilter}
                    />
                    <BodyFilter
                        uniqueName={filterNames.body}
                        selectedValues={bodyFilter}
                        setValues={setBodyFilter}
                    />
                    <PreferencesFilter
                        uniqueName={filterNames.preferences}
                        selectedItems={preferencesFilter}
                        setFiltered={setPreferencesFilter}
                    />
                    <NoContactsFilter
                        uniqueName={filterNames.noContacts}
                        value={noContactsFilter}
                        setValue={setNoContactsFilter}
                    />
                </ScrollableView.Body>
            </ScrollableView>
            <div className='talents-container__list'>
                <ScrollableView scrollContainerRef={scrollContainerRef} className='talents-container__list-section section-primary'>
                    <ScrollableView.Header className='talents-list__header'>
                        <Form
                            form={form}
                            name='talents.search.form'
                            initialValues={{ search: searchString }}
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
