import './TalentProfile.css';
import '../../helpers/info-panel.css';
import '../../helpers/shared.css';

import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Form } from 'antd';
import dayjs from 'dayjs';

import { talentActions, getTalent, fetchTalentById, updateTalentById, getUpdateResponse, createTalent, getCreateResponse, deleteTalentById, getDeleteResponse } from '../../store/talents/talent';
import { fetchTalents } from '../../store/talents/talents';

import TalentSectionPrimaryInfo from './sections/TalentSectionPrimaryInfo';
import TalentSectionNotes from './sections/TalentSectionNotes';
import TalentSectionBody from './sections/TalentSectionBody';
import TalentSectionFoodAllergies from './sections/TalentSectionFoodAllergies';
import TalentSectionRegionLanguages from './sections/TalentSectionRegionLanguages';
import TalentSectionPreferences from './sections/TalentSectionPreferences';
import TalentSectionAchievements from './sections/TalentSectionAchievements';
import TalentSectionPerformanceSkills from './sections/TalentSectionPerformanceSkills';
import TalentSectionBiography from './sections/TalentSectionBiography';
import TalentSectionSystemInfo from './sections/TalentSectionSystemInfo';
import TalentSectionMain from './sections/TalentSectionMain';
import TalentSectionRelatives from './sections/TalentSectionRelatives';
import TalentSectionAddresses from './sections/TalentSectionAddresses';
import TalentSectionPhones from './sections/TalentSectionPhones';
import TalentSectionEmails from './sections/TalentSectionEmails';
import TalentSectionSocialMedia from './sections/TalentSectionSocialMedia';
import TalentSectionMessengers from './sections/TalentSectionMessengers';

import { useNotification } from '../notifications/NotificationProvider';

function TalentProfile(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const showNotification = useNotification();

    const talent = useSelector(getTalent);
    const createResponse = useSelector(getCreateResponse);
    const updateResponse = useSelector(getUpdateResponse);
    const deleteResponse = useSelector(getDeleteResponse);

    const [editMode, setEditMode] = useState(props.newTalent ? true : false);
    const [talentId, setTalentId] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleForm = () => {
        setEditMode(!editMode);
    };

    const initForm = () => {
        form.setFieldsValue({
            first_name: talent.first_name || '',
            last_name: talent.last_name || '',

            legal_first_name: talent.legal_first_name || '',
            legal_last_name: talent.legal_last_name || '',
            birth_date: talent.birth_date ? dayjs(talent.birth_date, 'DD.MM.YYYY') : null,
            marital_status_id: talent.marital_status_id || '',
            is_lifestyle: talent.is_lifestyle,
            gender_id: talent.gender_id || '',

            comment: talent.comment || '',

            relatives: talent.relatives || null,
            addresses: talent.addresses || null,
            phones: talent.phones || null,
            emails: talent.emails || null,
            social_medias: talent.social_medias || null,
            messengers: talent.messengers || null,

            hair_color_id: talent.hair_color_id || '',
            hair_length_id: talent.hair_length_id || '',
            eye_color_id: talent.eye_color_id || '',
            cup_size_id: talent.cup_size_id || '',
            shoe_size_id: talent.shoe_size_id || '',
            shirt_size_id: talent.shirt_size_id || '',
            suit_cut_id: talent.suit_cut_id || '',
            dress_size_id: talent.dress_size_id || '',
            skin_color_id: talent.skin_color_id || '',
            is_ears_pierced: talent.is_ears_pierced,
            height_cm: talent.height_cm || '',
            bust_cm: talent.bust_cm || '',
            waist_cm: talent.waist_cm || '',
            hips_cm: talent.hips_cm || '',
            weight_kg: talent.weight_kg || '',
            scars: talent.scars || '',
            tattoos: talent.tattoos || '',
            piercings: talent.piercings || '',

            allergies: talent.allergies || '',
            is_vegetarian: talent.is_vegetarian,

            citizenships: (talent.citizenships || []).map((d) => (d.alpha_2)),
            languages: (talent.languages || []).map((d) => (d.id)),
            is_accent: talent.is_accent,

            is_lingerie: talent.is_lingerie,
            is_nude: talent.is_nude,
            is_fur: talent.is_fur,
            is_liquor_ads: talent.is_liquor_ads,
            is_smoking_ads: talent.is_smoking_ads,
            is_gambling_ads: talent.is_gambling_ads,
            is_faithbased_ads: talent.is_faithbased_ads,
            is_political_ads: talent.is_political_ads,
            is_topless: talent.is_topless,
            is_swimwear: talent.is_swimwear,
            is_sports: talent.is_sports,

            achievements: talent.achievements || '',
            performance_skills: talent.performance_skills || '',
            biography: talent.biography || '',
        });
    };

    const handleCancel = () => {
        form.resetFields();
        initForm();
        toggleForm();

        if (props.newTalent) {
            navigate('/app/talents', { replace: true });
        }
    };

    const handleSave = () => {
        form.submit();
    };

    const handleDelete = () => {
        dispatch(deleteTalentById({ talentId: talent.id }));
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFormSubmit = (values) => {
        setLoading(true);

        values.birth_date = values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null;
        values.marital_status_id = values.marital_status_id ?? null;
        values.gender_id = values.gender_id ?? null;
        values.is_lifestyle = (values.is_lifestyle === "Lifestyle") ? 1 : (values.is_lifestyle === "Fashion") ? 0 : null;

        values.hair_color_id = values.hair_color_id ?? null;
        values.hair_length_id = values.hair_length_id ?? null;
        values.eye_color_id = values.eye_color_id ?? null;
        values.skin_color_id = values.skin_color_id ?? null;
        values.cup_size_id = values.cup_size_id ?? null;
        values.is_ears_pierced = (values.is_ears_pierced === "Yes") ? 1 : (values.is_ears_pierced === "No") ? 0 : null;
        values.shoe_size_id = values.shoe_size_id ?? null;
        values.shirt_size_id = values.shirt_size_id ?? null;
        values.suit_cut_id = values.suit_cut_id ?? null;
        values.dress_size_id = values.dress_size_id ?? null;

        values.is_vegetarian = (values.is_vegetarian === "Yes") ? 1 : (values.is_vegetarian === "No") ? 0 : null;

        values.is_accent = (values.is_accent === "Yes") ? 1 : (values.is_accent === "No") ? 0 : null;

        values.is_lingerie = (values.is_lingerie === "Yes") ? 1 : (values.is_lingerie === "No") ? 0 : null;
        values.is_nude = (values.is_nude === "Yes") ? 1 : (values.is_nude === "No") ? 0 : null;
        values.is_fur = (values.is_fur === "Yes") ? 1 : (values.is_fur === "No") ? 0 : null;
        values.is_liquor_ads = (values.is_liquor_ads === "Yes") ? 1 : (values.is_liquor_ads === "No") ? 0 : null;
        values.is_smoking_ads = (values.is_smoking_ads === "Yes") ? 1 : (values.is_smoking_ads === "No") ? 0 : null;
        values.is_gambling_ads = (values.is_gambling_ads === "Yes") ? 1 : (values.is_gambling_ads === "No") ? 0 : null;
        values.is_faithbased_ads = (values.is_faithbased_ads === "Yes") ? 1 : (values.is_faithbased_ads === "No") ? 0 : null;
        values.is_political_ads = (values.is_political_ads === "Yes") ? 1 : (values.is_political_ads === "No") ? 0 : null;
        values.is_topless = (values.is_topless === "Yes") ? 1 : (values.is_topless === "No") ? 0 : null;
        values.is_swimwear = (values.is_swimwear === "Yes") ? 1 : (values.is_swimwear === "No") ? 0 : null;
        values.is_sports = (values.is_sports === "Yes") ? 1 : (values.is_sports === "No") ? 0 : null;

        if (props.newTalent) {
            dispatch(createTalent({ values: values }));
        }
        else {
            dispatch(updateTalentById({ talentId: talent.id, values: values }));
        }
    };

    useEffect(() => {
        if (props.newTalent) {
            dispatch(talentActions.resetState());
            setEditMode(true);
        }
        else {
            setEditMode(false);
        }
    }, [params, dispatch]);

    useEffect(() => {
        if (props.talentId && talentId !== props.talentId) {
            dispatch(fetchTalentById(props.talentId));
        }
        else if (params.id && talentId !== params.id) {
            dispatch(fetchTalentById(params.id));
        }
        setTalentId(params.id);

    }, [talentId, params.id, props.talentId, dispatch]);

    useEffect(() => {
        initForm();
    }, [talent, form]);

    useEffect(() => {
        setLoading(false);
        if (createResponse.status === 'fulfilled') {
            showNotification({ type: "SUCCESS", message: "Talent created" });
            dispatch(fetchTalents());
            toggleForm();
            dispatch(talentActions.resetResponse('create'));
            navigate('/app/talents/' + createResponse.talentId, { replace: true });
        }
    }, [createResponse]);

    useEffect(() => {
        setLoading(false);
        if (updateResponse.status === 'fulfilled') {
            showNotification({ type: "SUCCESS", message: "Changes saved" });
            dispatch(fetchTalents());
            toggleForm();
            dispatch(talentActions.resetResponse('update'));
        }
    }, [updateResponse]);

    useEffect(() => {
        setLoading(false);
        if (deleteResponse.status === 'fulfilled') {
            showNotification({ type: "SUCCESS", message: "Talent deleted" });
            dispatch(fetchTalents());
            toggleForm();
            dispatch(talentActions.resetResponse('delete'));
            navigate('/app/talents', { replace: true });
        }
    }, [deleteResponse]);

    let result = null;

    if (talent && Object.getPrototypeOf(talent) === Object.prototype) {
        result =
            <div className='info-panel'>
                <TalentSectionMain
                    editMode={editMode}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    toggleForm={toggleForm}
                    deleteTalent={handleDelete}
                    loading={loading}
                    isNewTalent={props.newTalent}
                />
                <TalentSectionPrimaryInfo editMode={editMode} />
                <TalentSectionNotes editMode={editMode} />
                <TalentSectionBody editMode={editMode} />
                <div className='info-panel--section info-panel--section_2col'>
                    <TalentSectionFoodAllergies editMode={editMode} />
                    <TalentSectionRegionLanguages editMode={editMode} />
                </div>
                <div className='info-panel--section info-panel--section_2col'>
                    <TalentSectionEmails editMode={editMode} />
                    <TalentSectionPhones editMode={editMode} />
                </div>
                <div className='info-panel--section info-panel--section_2col'>
                    <TalentSectionAddresses editMode={editMode} />
                    <TalentSectionSocialMedia editMode={editMode} />
                </div>
                <div className='info-panel--section info-panel--section_2col'>
                    <TalentSectionMessengers editMode={editMode} />
                    <TalentSectionRelatives editMode={editMode} />
                </div>
                <TalentSectionPreferences editMode={editMode} />
                <TalentSectionAchievements editMode={editMode} />
                <TalentSectionPerformanceSkills editMode={editMode} />
                <TalentSectionBiography editMode={editMode} />
                {props.newTalent ? '' : <TalentSectionSystemInfo />}
            </div>
            ;
    }

    return (
        <Form
            name="talent"
            form={form}
            onFinish={onFormSubmit}
            onFinishFailed={onFinishFailed}
            preserve={true}
        >
            {result}
        </Form>
    );
}

export default TalentProfile;