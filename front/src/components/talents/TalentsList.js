import './TalentsList.css';
import '../../helpers/shared.css';

import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Form, Input, Tooltip, Button } from 'antd';

import { getTalents, fetchTalents, filterTalents } from '../../store/talents/talents';

import ScrollableView from '../ui-components/ScrollableView';

import TalentUsername from './components/TalentUsername';

import BustFilter from '../filters/BustFilter';
import EyeColorFilter from '../filters/EyeColorFilter';
import GendersFilter from '../filters/GendersFilter';
import InTownFilter from '../filters/InTownFilter';
import HairColorFilter from '../filters/HairColorFilter';
import HeightFilter from '../filters/HeightFilter';
import HipsFilter from '../filters/HipsFilter';
import LocationsFilter from '../filters/LocationsFilter';
import ManagersFilter from '../filters/ManagersFilter';
import SkinColorFilter from '../filters/SkinColorFilter';
import WaistFilter from '../filters/WaistFilter';
import WeightFilter from '../filters/WeightFilter';

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
        locations: JSON.parse(sessionStorage.getItem('talentsPage.filteredLocations')) ?? [],
    });

    const [filteredBust, setFilteredBust] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredBust')) ?? []);
    const [filteredEyeColors, setFilteredEyeColors] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredEyeColors')) ?? []);
    const [filteredGenders, setFilteredGenders] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredGenders')) ?? []);
    const [filteredHairColors, setFilteredHairColors] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredHairColors')) ?? []);
    const [filteredHeights, setFilteredHeights] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredHeights')) ?? []);
    const [filteredHips, setFilteredHips] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredHips')) ?? []);
    const [filteredLocations, setFilteredLocations] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredLocations')) ?? []);
    const [filteredManagers, setFilteredManagers] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredManagers')) ?? []);
    const [filteredSkinColors, setFilteredSkinColors] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredSkinColors')) ?? []);
    const [filteredWaists, setFilteredWaists] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredWaists')) ?? []);
    const [filteredWeights, setFilteredWeights] = useState(JSON.parse(sessionStorage.getItem('talentsPage.filteredWeights')) ?? []);

    useEffect(() => {
        dispatch(fetchTalents({
            bust: filteredBust,
            eyeColors: filteredEyeColors,
            genders: filteredGenders,
            hairColors: filteredHairColors,
            heights: filteredHeights,
            hips: filteredHips,
            managers: filteredManagers,
            skinColors: filteredSkinColors,
            waists: filteredWaists,
            weights: filteredWeights,
        }));
    }, [
        dispatch,
        filteredBust,
        filteredEyeColors,
        filteredGenders,
        filteredHairColors,
        filteredHeights,
        filteredHips,
        filteredManagers,
        filteredSkinColors,
        filteredWaists,
        filteredWeights,
    ]);

    useEffect(() => {
        setTalents(filterTalents([...fetchedTalents], query));
    }, [fetchedTalents, query]);

    const searchTalents = (item) => {
        setQuery({
            searchString: item.search,
            inTownOnly: query.inTownOnly,
            locations: query.locations,
        });
        sessionStorage.setItem('talentsPage.talentsList.query.searchString', item.search);
    }

    const setInTownOnly = (item) => {
        setQuery({
            searchString: query.searchString,
            inTownOnly: item,
            locations: query.locations,
        });
        sessionStorage.setItem('talentsPage.talentsList.query.inTownOnly', item);
    }

    useEffect(() => {
        setQuery({
            searchString: query.searchString,
            inTownOnly: query.inTownOnly,
            locations: filteredLocations,
        });
    }, [filteredLocations]);

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
                    <LocationsFilter
                        uniqueName='talentsPage.locationsFilter'
                        selectedItems={filteredLocations}
                        setFiltered={setFilteredLocations}
                    />
                    <ManagersFilter
                        uniqueName='talentsPage.managersFilter'
                        selectedItems={filteredManagers}
                        setFiltered={setFilteredManagers}
                    />
                    <GendersFilter
                        uniqueName='talentsPage.gendersFilter'
                        selectedItems={filteredGenders}
                        setFiltered={setFilteredGenders}
                    />
                    <BustFilter
                        uniqueName='talentsPage.bustFilter'
                        selectedItems={filteredBust}
                        setFiltered={setFilteredBust}
                    />
                    <HeightFilter
                        uniqueName='talentsPage.heightFilter'
                        selectedItems={filteredHeights}
                        setFiltered={setFilteredHeights}
                    />
                    <HipsFilter
                        uniqueName='talentsPage.hipsFilter'
                        selectedItems={filteredHips}
                        setFiltered={setFilteredHips}
                    />
                    <WaistFilter
                        uniqueName='talentsPage.waistFilter'
                        selectedItems={filteredWaists}
                        setFiltered={setFilteredWaists}
                    />
                    <WeightFilter
                        uniqueName='talentsPage.weightFilter'
                        selectedItems={filteredWeights}
                        setFiltered={setFilteredWeights}
                    />
                    <EyeColorFilter
                        uniqueName='talentsPage.eyeColorFilter'
                        selectedItems={filteredEyeColors}
                        setFiltered={setFilteredEyeColors}
                    />
                    <HairColorFilter
                        uniqueName='talentsPage.hairColorFilter'
                        selectedItems={filteredHairColors}
                        setFiltered={setFilteredHairColors}
                    />
                    <SkinColorFilter
                        uniqueName='talentsPage.skinColorFilter'
                        selectedItems={filteredSkinColors}
                        setFiltered={setFilteredSkinColors}
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
