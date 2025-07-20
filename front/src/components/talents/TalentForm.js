import { useSelector } from 'react-redux';
import { useCallback } from 'react';

import BaseForm from '../ui-components/BaseForm';
import { talentFormConfig } from '../../store/talents/talentFormConfig';

import SharedSectionAddresses from '../nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/edit/SharedSectionSocialMedia';

import TalentSectionAchievements from '../nested-sections/talents/edit/TalentSectionAchievements';
import TalentSectionBiography from '../nested-sections/talents/edit/TalentSectionBiography';
import TalentSectionBody from '../nested-sections/talents/edit/TalentSectionBody';
import TalentSectionFoodAllergies from '../nested-sections/talents/edit/TalentSectionFoodAllergies';
import TalentSectionPerformanceSkills from '../nested-sections/talents/edit/TalentSectionPerformanceSkills';
import TalentSectionPreferences from '../nested-sections/talents/edit/TalentSectionPreferences';
import TalentSectionPrimaryInfo from '../nested-sections/talents/edit/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from '../nested-sections/talents/edit/TalentSectionRegionLanguages';
import TalentSectionRelatives from '../nested-sections/talents/edit/TalentSectionRelatives';

function TalentForm(props) {
    const { isNewTalent, open: isFormOpen, closeForm: onClose, onAfterSubmit, talentId } = props;
    const user_id = useSelector((state) => state.auth.user_id);

    // Enhance the onInitForm to pass the user_id for default manager assignment
    const onInitForm = useCallback((values, form) => {
        talentFormConfig.onInitForm(values, form, { user_id });
    }, [user_id]);

    return (
        <BaseForm
            {...talentFormConfig}
            entityId={isNewTalent ? null : talentId}
            open={isFormOpen}
            onClose={onClose}
            onAfterSubmit={onAfterSubmit}
            onInitForm={onInitForm}
        >
            <SharedSectionNotes id='notes' />
            <TalentSectionPrimaryInfo id='primary-info' />
            <TalentSectionFoodAllergies id='food-allergies' />
            <TalentSectionBody id='body' />
            <SharedSectionContacts id='contacts' />
            <TalentSectionRegionLanguages id='region-languages' />
            <TalentSectionPreferences id='preferences' />
            <SharedSectionSocialMedia id='social-media' />
            <SharedSectionAddresses id='addresses' />
            <TalentSectionRelatives id='relatives' />
            <TalentSectionBiography id='biography' />
            <TalentSectionAchievements id='achievements' />
            <TalentSectionPerformanceSkills id='performance-skills' />
        </BaseForm>
    );
}

export default TalentForm;