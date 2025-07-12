import './TalentView.css';
import '../../helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import { getTalent, fetchTalentById } from '../../store/talents/talent';

import ScrollableView from '../ui-components/ScrollableView';

import TalentSectionAchievements from '../nested-sections/talents/view/TalentSectionAchievements';
import TalentSectionAddresses from '../nested-sections/talents/view/TalentSectionAddresses';
import TalentSectionBiography from '../nested-sections/talents/view/TalentSectionBiography';
import TalentSectionBody from '../nested-sections/talents/view/TalentSectionBody';
import TalentSectionContacts from '../nested-sections/talents/view/TalentSectionContacts';
import TalentSectionFoodAllergies from '../nested-sections/talents/view/TalentSectionFoodAllergies';
import TalentSectionMain from '../nested-sections/talents/view/TalentSectionMain';
import TalentSectionNotes from '../nested-sections/talents/view/TalentSectionNotes';
import TalentSectionPerformanceSkills from '../nested-sections/talents/view/TalentSectionPerformanceSkills';
import TalentSectionPreferences from '../nested-sections/talents/view/TalentSectionPreferences';
import TalentSectionPrimaryInfo from '../nested-sections/talents/view/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from '../nested-sections/talents/view/TalentSectionRegionLanguages';
import TalentSectionRelatives from '../nested-sections/talents/view/TalentSectionRelatives';
import TalentSectionSocialMedia from '../nested-sections/talents/view/TalentSectionSocialMedia';
import TalentSectionSystemInfo from '../nested-sections/talents/view/TalentSectionSystemInfo';

function TalentView(props) {
    const dispatch = useDispatch();
    const params = useParams();
    const talent = useSelector(getTalent);
    const [talentId, setTalentId] = useState(null);
    const scrollContainerRef = useRef(null);
    const context = useOutletContext();

    useEffect(() => {
        if (props.talentId)
            setTalentId(props.talentId);
        else if (params.id)
            setTalentId(params.id);
    }, [params.id, props.talentId]);

    useEffect(() => {
        if (talentId) {
            dispatch(fetchTalentById(talentId));
        }
    }, [talentId, dispatch]);

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [talent]);

    let result = null;

    if (
        talent
        && Object.getPrototypeOf(talent) === Object.prototype
    ) {
        result =
            <ScrollableView className='talent-profile'>
                <ScrollableView.Header scrollContainerRef={scrollContainerRef}>
                    <TalentSectionMain talent={talent} editAction={context?.editTalent} />
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='talent-profile__body'>
                    <TalentSectionAchievements talent={talent} className='talent-section__achievements' />
                    <TalentSectionAddresses talent={talent} className='talent-section__addresses' />
                    <TalentSectionBiography talent={talent} className='talent-section__biography' />
                    <TalentSectionBody talent={talent} className='talent-section__body' />
                    <TalentSectionContacts talent={talent} className='talent-section__contacts' />
                    <TalentSectionFoodAllergies talent={talent} className='talent-section__food-allergies' />
                    <TalentSectionNotes talent={talent} className='talent-section__notes' />
                    <TalentSectionPerformanceSkills talent={talent} className='talent-section__performance-skills' />
                    <TalentSectionPreferences talent={talent} className='talent-section__preferences' />
                    <TalentSectionPrimaryInfo talent={talent} className='talent-section__primary-info' />
                    <TalentSectionRegionLanguages talent={talent} className='talent-section__region-languages' />
                    <TalentSectionRelatives talent={talent} className='talent-section__relatives' />
                    <TalentSectionSocialMedia talent={talent} className='talent-section__social-media' />
                    <TalentSectionSystemInfo talent={talent} className='talent-section__system-info' />
                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default TalentView;
