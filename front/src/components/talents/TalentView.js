import './TalentView.css';
import '../../helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import { getTalent, fetchTalent } from '../../store/talents/talent';

import ScrollableView from '../ui-components/ScrollableView';

import SharedSectionAddresses from '../nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from '../nested-sections/shared/view/SharedSectionSystemInfo';

import TalentSectionAchievements from '../nested-sections/talents/view/TalentSectionAchievements';
import TalentSectionBiography from '../nested-sections/talents/view/TalentSectionBiography';
import TalentSectionBody from '../nested-sections/talents/view/TalentSectionBody';
import TalentSectionFoodAllergies from '../nested-sections/talents/view/TalentSectionFoodAllergies';
import TalentSectionMain from '../nested-sections/talents/view/TalentSectionMain';
import TalentSectionPerformanceSkills from '../nested-sections/talents/view/TalentSectionPerformanceSkills';
import TalentSectionPreferences from '../nested-sections/talents/view/TalentSectionPreferences';
import TalentSectionPrimaryInfo from '../nested-sections/talents/view/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from '../nested-sections/talents/view/TalentSectionRegionLanguages';
import TalentSectionRelatives from '../nested-sections/talents/view/TalentSectionRelatives';

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
            dispatch(fetchTalent({ id: talentId }));
        }
    }, [dispatch, talentId]);

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
                    <TalentSectionMain data={talent} editAction={context?.editTalent} />
                </ScrollableView.Header>
                <ScrollableView.Body scrollContainerRef={scrollContainerRef} className='talent-profile__body'>
                    <TalentSectionAchievements data={talent} className='talent-section__achievements' />
                    <SharedSectionAddresses data={talent} className='talent-section__addresses' />
                    <TalentSectionBiography data={talent} className='talent-section__biography' />
                    <TalentSectionBody data={talent} className='talent-section__body' />
                    <SharedSectionContacts data={talent} className='talent-section__contacts' />
                    <TalentSectionFoodAllergies data={talent} className='talent-section__food-allergies' />
                    <SharedSectionNotes data={talent} className='talent-section__notes' />
                    <TalentSectionPerformanceSkills data={talent} className='talent-section__performance-skills' />
                    <TalentSectionPreferences data={talent} className='talent-section__preferences' />
                    <TalentSectionPrimaryInfo data={talent} className='talent-section__primary-info' />
                    <TalentSectionRegionLanguages data={talent} className='talent-section__region-languages' />
                    <TalentSectionRelatives data={talent} className='talent-section__relatives' />
                    <SharedSectionSocialMedia data={talent} className='talent-section__social-media' />
                    <SharedSectionSystemInfo data={talent} className='talent-section__system-info' />
                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default TalentView;
