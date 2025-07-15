import './TalentForm.css';

import { Anchor, Button, Form, Modal, Popconfirm } from 'antd';

import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState, useCallback } from 'react';
import dayjs from 'dayjs';

import {
    fetchTalentById, getTalent,
    createTalent, getCreateResponse,
    updateTalentById, getUpdateResponse,
    deleteTalentById, getDeleteResponse,
    talentActions
} from '../../store/talents/talent';

import CustomDrawer from '../ui-components/CustomDrawer';
import ScrollableView from '../ui-components/ScrollableView';

import { useNotification } from '../notifications/NotificationProvider';

import { cleanCollection } from '../../helpers/form-utils';
import { sanitizeWeblinkForStorage } from '../ui-components/Weblink';

import { LoadingOutlined } from '@ant-design/icons';
import { ReactComponent as IconClose } from '../../assets/icons/close.svg';

import TalentSectionAchievements from './sections/edit/TalentSectionAchievements';
import TalentSectionAddresses from './sections/edit/TalentSectionAddresses';
import TalentSectionBiography from './sections/edit/TalentSectionBiography';
import TalentSectionBody from './sections/edit/TalentSectionBody';
import TalentSectionContacts from './sections/edit/TalentSectionContacts';
import TalentSectionFoodAllergies from './sections/edit/TalentSectionFoodAllergies';
import TalentSectionNotes from './sections/edit/TalentSectionNotes';
import TalentSectionPerformanceSkills from './sections/edit/TalentSectionPerformanceSkills';
import TalentSectionPreferences from './sections/edit/TalentSectionPreferences';
import TalentSectionPrimaryInfo from './sections/edit/TalentSectionPrimaryInfo';
import TalentSectionRegionLanguages from './sections/edit/TalentSectionRegionLanguages';
import TalentSectionRelatives from './sections/edit/TalentSectionRelatives';
import TalentSectionSocialMedia from './sections/edit/TalentSectionSocialMedia';

function TalentForm(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const talent = useSelector(getTalent);
    const createResponse = useSelector(getCreateResponse);
    const updateResponse = useSelector(getUpdateResponse);
    const deleteResponse = useSelector(getDeleteResponse);
    const user_id = useSelector((state) => state.auth.user_id);
    const getContainer = () => containerRef.current;
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formTitle, setFormTitle] = useState();
    const [originalFormValues, setOriginalFormValues] = useState();
    const [isConfirmClosingModalOpen, setIsConfirmClosingModalOpen] = useState(false);
    const showNotification = useNotification();

    const { isNewTalent, open: isFormOpen, closeForm: onClose, onAfterSubmit } = props;

    const initForm = useCallback((values) => {
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

            comment: values.comment || '',

            relatives: (values.relatives && values.relatives.length > 0)
                ? values.relatives
                : [{ type: { id: null }, info: '' }],
            addresses: (values.addresses && values.addresses.length > 0)
                ? values.addresses
                : [{ type: { id: null }, info: '' }],
            phones: (values.phones && values.phones.length > 0)
                ? values.phones
                : [{ type: { id: null }, info: '' }],
            social_medias: (values.social_medias && values.social_medias.length > 0)
                ? values.social_medias
                : [{ type: { id: null }, info: '' }],
            emails: values.emails || null,
            messengers: values.messengers || null,
            weblinks: values.weblinks || null,

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
        });
        setOriginalFormValues(form.getFieldsValue(true));
    }, [form, user_id]);

    const submitForm = (formValues) => {
        setIsLoading(true);

        const values = formValues || form.getFieldsValue();

        values.birth_date = values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null;
        values.marital_status_id = values.marital_status_id ?? null;
        values.gender_id = values.gender_id ?? null;
        values.is_lifestyle = (values.is_lifestyle === 'Lifestyle') ? 1 : (values.is_lifestyle === 'Fashion') ? 0 : null;
        values.board_id = values.board_id ?? null;
        values.mother_agency_id = values.mother_agency_id ?? null;

        values.hair_color_id = values.hair_color_id ?? null;
        values.hair_length_id = values.hair_length_id ?? null;
        values.eye_color_id = values.eye_color_id ?? null;
        values.skin_color_id = values.skin_color_id ?? null;
        values.cup_size_id = values.cup_size_id ?? null;
        values.shoe_size_id = values.shoe_size_id ?? null;
        values.shirt_size_id = values.shirt_size_id ?? null;
        values.suit_cut_id = values.suit_cut_id ?? null;
        values.dress_size_id = values.dress_size_id ?? null;

        if (values.addresses) {
            values.addresses = values.addresses.map(address => ({
                ...address,
                type: { id: address.type.id ?? null }
            }));
        }
        if (values.emails) {
            values.emails = values.emails.map(email => ({
                ...email,
                type: { id: email.type.id ?? null }
            }));
        }
        if (values.messengers) {
            values.messengers = values.messengers.map(messenger => ({
                ...messenger,
                type: { id: messenger.type.id ?? null }
            }));
        }
        if (values.phones) {
            values.phones = values.phones.map(phone => ({
                ...phone,
                type: { id: phone.type.id ?? null }
            }));
        }
        if (values.relatives) {
            values.relatives = values.relatives.map(relative => ({
                ...relative,
                type: { id: relative.type.id ?? null }
            }));
        }
        if (values.social_medias) {
            values.social_medias = values.social_medias.map(socialMedia => ({
                ...socialMedia,
                type: { id: socialMedia.type.id ?? null }
            }));
        }
        if (values.weblinks) {
            values.weblinks = values.weblinks.map(weblink => ({
                ...weblink,
                info: sanitizeWeblinkForStorage(weblink.info)
            }));
        }

        values.addresses = cleanCollection(values.addresses, { requiredAny: ['info'] });
        values.emails = cleanCollection(values.emails, { requiredAny: ['info'] });
        values.phones = cleanCollection(values.phones, { requiredAny: ['info'] });
        values.relatives = cleanCollection(values.relatives, { requiredAny: ['info'] });
        values.messengers = cleanCollection(values.messengers, { requiredAll: ['type.id', 'info'] });
        values.social_medias = cleanCollection(values.social_medias, { requiredAll: ['type.id', 'info'] });
        values.weblinks = cleanCollection(values.weblinks, { requiredAny: ['info'] });

        if (isNewTalent) {
            dispatch(createTalent({ values: values }));
        }
        else {
            dispatch(updateTalentById({ talentId: talent.id, values: values }));
        }
    };

    const anchorItems = [
        {
            key: 'notes',
            href: '#notes',
            title: 'Notes',
        },
        {
            key: 'primary-info',
            href: '#primary-info',
            title: 'Primary Info',
        },
        {
            key: 'food-allergies',
            href: '#food-allergies',
            title: 'Food & Allergies',
        },
        {
            key: 'body',
            href: '#body',
            title: 'Body',
        },
        {
            key: 'contacts',
            href: '#contacts',
            title: 'Contacts',
        },
        {
            key: 'region-languages',
            href: '#region-languages',
            title: 'Region & Languages',
        },
        {
            key: 'preferences',
            href: '#preferences',
            title: 'Preferences',
        },
        {
            key: 'social-media',
            href: '#social-media',
            title: 'Social Media',
        },
        {
            key: 'addresses',
            href: '#addresses',
            title: 'Addresses',
        },
        {
            key: 'relatives',
            href: '#relatives',
            title: 'Relatives',
        },
        {
            key: 'biography',
            href: '#biography',
            title: 'Biography',
        },
        {
            key: 'achievements',
            href: '#achievements',
            title: 'Achievements',
        },
        {
            key: 'performance-skills',
            href: '#performance-skills',
            title: 'Performance Skills',
        },
    ];

    const deleteTalent = () => {
        setIsLoading(true);
        dispatch(deleteTalentById({ talentId: talent.id }));
    };

    useEffect(() => {
        if (!isNewTalent && talent.id && isFormOpen) {
            dispatch(fetchTalentById(talent.id));
        }
    }, [isNewTalent, talent.id, isFormOpen, dispatch]);

    useEffect(() => {
        if (isNewTalent) {
            setFormTitle('New Talent');
            initForm({});
        } else if (talent.id) {
            setFormTitle(talent.full_name);
            initForm(talent);
        }
    }, [isNewTalent, talent, form, initForm]);

    useEffect(() => {
        if (createResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: 'Changes saved' });
            onAfterSubmit();
            dispatch(talentActions.resetResponse('create'));
            navigate('/app/talents/' + createResponse.talentId);
            onClose();
        }
    }, [createResponse, dispatch, navigate, onClose, showNotification, onAfterSubmit]);

    useEffect(() => {
        if (updateResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: 'Changes saved' });
            onAfterSubmit();
            dispatch(talentActions.resetResponse('update'));
            onClose();
        }
    }, [updateResponse, dispatch, onClose, showNotification, onAfterSubmit]);

    useEffect(() => {
        if (deleteResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: 'Talent deleted' });
            onAfterSubmit();
            dispatch(talentActions.resetResponse('delete'));
            navigate('/app/talents', { replace: true });
            onClose();
        }
    }, [deleteResponse, dispatch, navigate, onClose, showNotification, onAfterSubmit]);

    const anchorClicked = (e, link) => {
        e.preventDefault();

        const container = getContainer();
        container.querySelectorAll('.nested-section').forEach(el => {
            el.classList.remove('highlighted');
        });

        if (link) {
            const targetId = link.href.replace('#', '');
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.classList.add('highlighted');
            }
        }
    };

    const handleDrawerSubmit = () => {
        form.submit();
    };

    const closeForm = () => {
        const currentFormValues = form.getFieldsValue(true);
        const hasChanged = JSON.stringify(currentFormValues) !== JSON.stringify(originalFormValues);
        hasChanged ? setIsConfirmClosingModalOpen(true) : onClose();
    };

    const handleConfirmClosingModalSaveChanges = () => {
        form.submit();
        setIsConfirmClosingModalOpen(false);
    };

    const handleConfirmClosingModalDiscardChanges = () => {
        setIsConfirmClosingModalOpen(false);
        onClose();
        form.setFieldsValue(originalFormValues);
    };

    const handleConfirmClosingModalCloseModal = () => {
        setIsConfirmClosingModalOpen(false);
    };

    return (
        <>
            <Form
                name='talent'
                form={form}
                preserve={true}
                colon={false}
                onFinish={submitForm}
                disabled={isLoading}
            >
                <CustomDrawer
                    open={isFormOpen}
                    onClose={closeForm}
                    width={768}
                >
                    <ScrollableView ref={containerRef}>
                        <ScrollableView.Header className='talent-form-header'>
                            <div className='talent-form-header__title'>
                                {formTitle}
                            </div>
                            <div className='talent-form-header__controls'>
                                <LoadingOutlined className={`talent-form-header__throbber ${isLoading ? '' : 'hidden'}`} />
                                <Popconfirm
                                    title='Delete Talent?'
                                    onConfirm={deleteTalent}
                                    okText='Delete'
                                    cancelText='Cancel'
                                >
                                    <Button danger>Delete</Button>
                                </Popconfirm>
                                <Button type='primary' onClick={handleDrawerSubmit}>Save</Button>
                                <Button type='text' icon={<IconClose />} onClick={closeForm} className='custom-drawer__close-button' />
                            </div>
                        </ScrollableView.Header>
                        <ScrollableView.Body className='talent-form'>
                            <div className='talent-form__sidebar'>
                                <Anchor
                                    getContainer={getContainer}
                                    items={anchorItems}
                                    offsetTop={12}
                                    affix={true}
                                    onClick={anchorClicked}
                                />
                            </div>
                            <div className='talent-form__body'>
                                <TalentSectionNotes id='notes' />
                                <TalentSectionPrimaryInfo id='primary-info' form={form} />
                                <TalentSectionFoodAllergies id='food-allergies' />
                                <TalentSectionBody id='body' />
                                <TalentSectionContacts id='contacts' form={form} />
                                <TalentSectionRegionLanguages id='region-languages' />
                                <TalentSectionPreferences id='preferences' />
                                <TalentSectionSocialMedia id='social-media' form={form} />
                                <TalentSectionAddresses id='addresses' />
                                <TalentSectionRelatives id='relatives' />
                                <TalentSectionBiography id='biography' />
                                <TalentSectionAchievements id='achievements' />
                                <TalentSectionPerformanceSkills id='performance-skills' />
                            </div>
                        </ScrollableView.Body>
                    </ScrollableView>
                </CustomDrawer>
            </Form>
            <Modal
                title='Save Changes?'
                closable={true}
                open={isConfirmClosingModalOpen}
                zIndex={2000}
                onOk={handleConfirmClosingModalSaveChanges}
                onCancel={handleConfirmClosingModalCloseModal}
                footer={[
                    <Button
                        key='back'
                        onClick={handleConfirmClosingModalCloseModal}
                    >
                        Cancel
                    </Button>,
                    <Button
                        key='discard'
                        type='default'
                        onClick={handleConfirmClosingModalDiscardChanges}
                    >
                        Don't Save
                    </Button>,
                    <Button
                        key='submit'
                        type='primary'
                        onClick={handleConfirmClosingModalSaveChanges}
                    >
                        Save
                    </Button>
                ]}
            >
                <p>Your changes will be lost if you don't save them.</p>
            </Modal>
        </>
    );
};

export default TalentForm;
