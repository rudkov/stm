import { useCallback } from 'react';
import dayjs from 'dayjs';

import { useCheckAuthQuery } from 'api/accountApi';

import BaseForm from 'components/ui-components/BaseForm';

import {
    useGetTalentQuery,
    useCreateTalentMutation,
    useUpdateTalentMutation,
    useDeleteTalentMutation,
} from 'api/talents/talentsApi';

import {
    initAddresses, processAddresses,
    initEmails, processEmails,
    initMessengers, processMessengers,
    initPhones, processPhones,
    initRelatives, processRelatives,
    initSocialMedias, processSocialMedias,
    initWeblinks, processWeblinks
} from 'helpers/form-utils';

import SharedSectionAddresses from 'components/nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from 'components/nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from 'components/nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from 'components/nested-sections/shared/edit/SharedSectionSocialMedia';

import TalentSectionAchievements from 'components/nested-sections/talents/edit/TalentSectionAchievements';
import TalentSectionBiography from 'components/nested-sections/talents/edit/TalentSectionBiography';
import TalentSectionBody from 'components/nested-sections/talents/edit/TalentSectionBody';
import TalentSectionFoodAllergies from 'components/nested-sections/talents/edit/TalentSectionFoodAllergies';
import TalentSectionPerformanceSkills from 'components/nested-sections/talents/edit/TalentSectionPerformanceSkills';
import TalentSectionPreferences from 'components/nested-sections/talents/edit/TalentSectionPreferences';
import TalentSectionPrimaryInfo from 'components/nested-sections/talents/edit/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from 'components/nested-sections/talents/edit/TalentSectionRegionLanguages';
import TalentSectionRelatives from 'components/nested-sections/talents/edit/TalentSectionRelatives';

function TalentForm({ isFormOpen, onClose, onAfterSubmit, talentId }) {
    const { data: authData } = useCheckAuthQuery();
    const user_id = authData.user.id;

    const onInitForm = useCallback((values, form) => {
        form.setFieldsValue({
            first_name: values.first_name || '',
            last_name: values.last_name || '',
            legal_first_name: values.legal_first_name || '',
            legal_last_name: values.legal_last_name || '',
            birth_date: values.birth_date ? dayjs(values.birth_date, 'DD.MM.YYYY') : null,
            marital_status_id: values.marital_status?.id || '',
            is_lifestyle: values.is_lifestyle,
            gender_id: values.gender?.id || '',
            manager_id: values.manager?.id || user_id,
            board_id: values.board?.id || '',
            mother_agency_id: values.mother_agency?.id || '',
            notes: values.notes || '',
            hair_color_id: values.hair_color?.id || '',
            hair_length_id: values.hair_length?.id || '',
            eye_color_id: values.eye_color?.id || '',
            cup_size_id: values.cup_size?.id || '',
            shoe_size_id: values.shoe_size?.id || '',
            shirt_size_id: values.shirt_size?.id || '',
            suit_cut_id: values.suit_cut?.id || '',
            dress_size_id: values.dress_size?.id || '',
            skin_color_id: values.skin_color?.id || '',
            is_ears_pierced: values.is_ears_pierced,
            height_cm: values.height_cm || '',
            bust_cm: values.bust_cm || '',
            waist_cm: values.waist_cm || '',
            hips_cm: values.hips_cm || '',
            weight_kg: values.weight_kg || '',
            scars: values.scars || '',
            tattoos: values.tattoos || '',
            piercings: values.piercings || '',
            allergies: values.allergies || '',
            is_vegetarian: values.is_vegetarian,
            citizenships: (values.citizenships || []).map((d) => (d.alpha_2)),
            languages: (values.languages || []).map((d) => (d.id)),
            is_accent: values.is_accent,
            is_lingerie: values.is_lingerie,
            is_nude: values.is_nude,
            is_fur: values.is_fur,
            is_liquor_ads: values.is_liquor_ads,
            is_smoking_ads: values.is_smoking_ads,
            is_gambling_ads: values.is_gambling_ads,
            is_faithbased_ads: values.is_faithbased_ads,
            is_political_ads: values.is_political_ads,
            is_topless: values.is_topless,
            is_swimwear: values.is_swimwear,
            is_sports: values.is_sports,
            achievements: values.achievements || '',
            performance_skills: values.performance_skills || '',
            biography: values.biography || '',

            ...initAddresses(values),
            ...initEmails(values),
            ...initMessengers(values),
            ...initPhones(values),
            ...initRelatives(values),
            ...initSocialMedias(values),
            ...initWeblinks(values),
        });
    }, [user_id]);

    const onProcessFormData = useCallback((values) => {
        const processed = {
            ...values,
            birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
            marital_status_id: values.marital_status_id ?? null,
            gender_id: values.gender_id ?? null,
            is_lifestyle: (values.is_lifestyle === 'Lifestyle') ? 1 : (values.is_lifestyle === 'Fashion') ? 0 : null,
            board_id: values.board_id ?? null,
            mother_agency_id: values.mother_agency_id ?? null,
            hair_color_id: values.hair_color_id ?? null,
            hair_length_id: values.hair_length_id ?? null,
            eye_color_id: values.eye_color_id ?? null,
            skin_color_id: values.skin_color_id ?? null,
            cup_size_id: values.cup_size_id ?? null,
            shoe_size_id: values.shoe_size_id ?? null,
            shirt_size_id: values.shirt_size_id ?? null,
            suit_cut_id: values.suit_cut_id ?? null,
            dress_size_id: values.dress_size_id ?? null,
        };

        return {
            ...processed,
            ...processAddresses(processed),
            ...processEmails(processed),
            ...processMessengers(processed),
            ...processPhones(processed),
            ...processRelatives(processed),
            ...processSocialMedias(processed),
            ...processWeblinks(processed),
        };
    }, []);

    const getTitle = useCallback((entity, isNew) => {
        if (isNew) {
            return 'New Talent';
        }
        return entity?.full_name || 'Edit Talent';
    }, []);

    const getDeleteConfirmationText = useCallback((entity) => {
        return `Delete ${entity?.full_name || 'talent'}?`;
    }, []);

    return (
        <BaseForm
            entityId={talentId}
            entityName='talent'
            entityUrl='/app/talents'

            enableDelete={true}
            enableAnchorNavigation={true}
            formWidth={768}

            anchorItems={[
                { key: 'notes', href: '#notes', title: 'Notes' },
                { key: 'primary-info', href: '#primary-info', title: 'Primary Info' },
                { key: 'food-allergies', href: '#food-allergies', title: 'Food & Allergies' },
                { key: 'body', href: '#body', title: 'Body' },
                { key: 'contacts', href: '#contacts', title: 'Contacts' },
                { key: 'region-languages', href: '#region-languages', title: 'Region & Languages' },
                { key: 'preferences', href: '#preferences', title: 'Preferences' },
                { key: 'social-media', href: '#social-media', title: 'Social Media' },
                { key: 'addresses', href: '#addresses', title: 'Addresses' },
                { key: 'relatives', href: '#relatives', title: 'Relatives' },
                { key: 'biography', href: '#biography', title: 'Biography' },
                { key: 'achievements', href: '#achievements', title: 'Achievements' },
                { key: 'performance-skills', href: '#performance-skills', title: 'Performance Skills' },
            ]}

            apiActions={{
                query: useGetTalentQuery,
                create: useCreateTalentMutation,
                update: useUpdateTalentMutation,
                delete: useDeleteTalentMutation,
            }}

            onInitForm={onInitForm}
            onProcessFormData={onProcessFormData}
            getTitle={getTitle}
            getDeleteConfirmationText={getDeleteConfirmationText}
            open={isFormOpen}
            onClose={onClose}
            onAfterSubmit={onAfterSubmit}
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
