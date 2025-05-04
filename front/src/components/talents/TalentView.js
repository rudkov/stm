import './TalentView.css';
import '../../helpers/shared.css';

import { useParams } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';

import { getTalent, fetchTalentById } from '../../store/talents/talent';

import TalentSectionAchievements from './sections/TalentSectionAchievements';
import TalentSectionAddresses from './sections/TalentSectionAddresses';
import TalentSectionBiography from './sections/TalentSectionBiography';
import TalentSectionBody from './sections/TalentSectionBody';
import TalentSectionContacts from './sections/TalentSectionContacts';
import TalentSectionFoodAllergies from './sections/TalentSectionFoodAllergies';
import TalentSectionMain from './sections/TalentSectionMain';
import TalentSectionNotes from './sections/TalentSectionNotes';
import TalentSectionPerformanceSkills from './sections/TalentSectionPerformanceSkills';
import TalentSectionPreferences from './sections/TalentSectionPreferences';
import TalentSectionPrimaryInfo from './sections/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from './sections/TalentSectionRegionLanguages';
import TalentSectionRelatives from './sections/TalentSectionRelatives';
import TalentSectionSocialMedia from './sections/TalentSectionSocialMedia';
import TalentSectionSystemInfo from './sections/TalentSectionSystemInfo';

// TODO: Fix a bug: when I open a talent and then click on create new talent (change URL) –
// the URL changes, but the view doesn't reload because it contains old data.

function TalentView(props) {
    const dispatch = useDispatch();
    const params = useParams();
    const talent = useSelector(getTalent);
    const [talentId, setTalentId] = useState(null);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        if (props.talentId)
            setTalentId(props.talentId);
        else if (params.id)
            setTalentId(params.id);
    }, [params.id, props.talentId]);

    useEffect(() => {
        if (talentId !== null)
            dispatch(fetchTalentById(talentId));
    }, [talentId]);

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [talent]);

    const editAction = () => {
        console.log('edit me');
    }

    let result = null;

    if (talent && Object.getPrototypeOf(talent) === Object.prototype) {
        result =
            <div className='talent-profile'>
                <div className='talent-profile__header'>
                    <TalentSectionMain talent={talent} editAction={editAction} />
                </div>
                <div ref={scrollContainerRef} className='talent-profile__body scrollbar-y'>
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
                </div>
            </div>
            ;
    }

    return result;
}

export default TalentView;