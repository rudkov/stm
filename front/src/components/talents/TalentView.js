import './TalentView.css';
import 'helpers/shared.css';

import { useParams, useOutletContext } from 'react-router';
import { useEffect, useRef } from 'react';

import { useGetTalentQuery } from 'api/talents/talentsApi';

import ScrollableView from 'components/ui-components/ScrollableView';

import SharedSectionAddresses from 'components/nested-sections/shared/view/SharedSectionAddresses';
import SharedSectionContacts from 'components/nested-sections/shared/view/SharedSectionContacts';
import SharedSectionNotes from 'components/nested-sections/shared/view/SharedSectionNotes';
import SharedSectionSocialMedia from 'components/nested-sections/shared/view/SharedSectionSocialMedia';
import SharedSectionSystemInfo from 'components/nested-sections/shared/view/SharedSectionSystemInfo';

import TalentSectionAchievements from 'components/nested-sections/talents/view/TalentSectionAchievements';
import TalentSectionBiography from 'components/nested-sections/talents/view/TalentSectionBiography';
import TalentSectionBody from 'components/nested-sections/talents/view/TalentSectionBody';
import TalentSectionEmergencyContacts from 'components/nested-sections/talents/view/TalentSectionEmergencyContacts';
import TalentSectionFoodAllergies from 'components/nested-sections/talents/view/TalentSectionFoodAllergies';
import TalentSectionMain from 'components/nested-sections/talents/view/TalentSectionMain';
import TalentSectionPerformanceSkills from 'components/nested-sections/talents/view/TalentSectionPerformanceSkills';
import TalentSectionPreferences from 'components/nested-sections/talents/view/TalentSectionPreferences';
import TalentSectionPrimaryInfo from 'components/nested-sections/talents/view/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from 'components/nested-sections/talents/view/TalentSectionRegionLanguages';

function TalentView(props) {
    const params = useParams();
    const scrollContainerRef = useRef(null);
    const context = useOutletContext();

    const { data: talent } = useGetTalentQuery({ id: params.id }, { skip: !params.id });

    useEffect(() => {
        if (scrollContainerRef.current)
            scrollContainerRef.current.scrollTop = 0;
    }, [talent]);

    let result = null;

    if (talent) {
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
                    <TalentSectionEmergencyContacts data={talent} className='talent-section__emergency-contacts' />
                    <SharedSectionSocialMedia data={talent} className='talent-section__social-media' />
                    <SharedSectionSystemInfo data={talent} className='talent-section__system-info' />
                </ScrollableView.Body>
            </ScrollableView>
            ;
    }

    return result;
}

export default TalentView;
