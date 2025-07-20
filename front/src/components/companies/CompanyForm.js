import './CompanyForm.css';

import { Button, Form, Modal, Popconfirm } from 'antd';

import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, useState, useCallback } from 'react';

import {
    fetchCompany, getCompany,
    createCompany, getCreateResponse,
    updateCompany, getUpdateResponse,
    deleteCompany, getDeleteResponse,
    companyActions
} from '../../store/companies/company';

import CustomDrawer from '../ui-components/CustomDrawer';
import ScrollableView from '../ui-components/ScrollableView';

import { useNotification } from '../notifications/NotificationProvider';

import { cleanCollection } from '../../helpers/form-utils';
import { sanitizeWeblinkForStorage } from '../ui-components/Weblink';

import { LoadingOutlined } from '@ant-design/icons';
import { ReactComponent as IconClose } from '../../assets/icons/close.svg';

import SharedSectionAddresses from '../nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionContacts from '../nested-sections/shared/edit/SharedSectionContacts';
import SharedSectionNotes from '../nested-sections/shared/edit/SharedSectionNotes';
import SharedSectionSocialMedia from '../nested-sections/shared/edit/SharedSectionSocialMedia';

function CompanyForm(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const company = useSelector(getCompany);
    const createResponse = useSelector(getCreateResponse);
    const updateResponse = useSelector(getUpdateResponse);
    const deleteResponse = useSelector(getDeleteResponse);
    const containerRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formTitle, setFormTitle] = useState();
    const [originalFormValues, setOriginalFormValues] = useState();
    const [isConfirmClosingModalOpen, setIsConfirmClosingModalOpen] = useState(false);
    const showNotification = useNotification();

    const { isNewCompany, open: isFormOpen, closeForm: onClose, onAfterSubmit } = props;

    const initForm = useCallback((values) => {
        form.setFieldsValue({
            name: values.name || '',
            notes: values.notes || '',

            addresses: (values.addresses && values.addresses.length > 0)
                ? values.addresses
                : [{ type: { id: null }, info: '' }],
            emails: values.emails || null,
            messengers: values.messengers || null,
            phones: (values.phones && values.phones.length > 0)
                ? values.phones
                : [{ type: { id: null }, info: '' }],
            social_medias: (values.social_medias && values.social_medias.length > 0)
                ? values.social_medias
                : [{ type: { id: null }, info: '' }],
            weblinks: values.weblinks || null,
        });
        setOriginalFormValues(form.getFieldsValue(true));
    }, [form]);

    const submitForm = (formValues) => {
        setIsLoading(true);

        const values = formValues || form.getFieldsValue();

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
        values.messengers = cleanCollection(values.messengers, { requiredAll: ['type.id', 'info'] });
        values.social_medias = cleanCollection(values.social_medias, { requiredAll: ['type.id', 'info'] });
        values.weblinks = cleanCollection(values.weblinks, { requiredAny: ['info'] });

        if (isNewCompany) {
            dispatch(createCompany({ values: values }));
        }
        else {
            dispatch(updateCompany({ id: company.id, values: values }));
        }
    };

    const deleteCompanyAction = () => {
        setIsLoading(true);
        dispatch(deleteCompany({ id: company.id }));
    };

    useEffect(() => {
        if (!isNewCompany && company.id && isFormOpen) {
            dispatch(fetchCompany({ id: company.id }));
        }
    }, [isNewCompany, company.id, isFormOpen, dispatch]);

    useEffect(() => {
        if (isNewCompany) {
            setFormTitle('New Company');
            initForm({});
        } else if (company.id) {
            setFormTitle(company.name);
            initForm(company);
        }
    }, [isNewCompany, company, form, initForm]);

    useEffect(() => {
        if (createResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: 'Changes saved' });
            onAfterSubmit();
            dispatch(companyActions.resetResponse('create'));
            navigate('/app/companies/' + createResponse.id);
            onClose();
        }
    }, [createResponse, dispatch, navigate, onClose, showNotification, onAfterSubmit]);

    useEffect(() => {
        if (updateResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: 'Changes saved' });
            onAfterSubmit();
            dispatch(companyActions.resetResponse('update'));
            onClose();
        }
    }, [updateResponse, dispatch, onClose, showNotification, onAfterSubmit]);

    useEffect(() => {
        if (deleteResponse.status === 'fulfilled') {
            setIsLoading(false);
            showNotification({ type: 'SUCCESS', message: 'Company deleted' });
            onAfterSubmit();
            dispatch(companyActions.resetResponse('delete'));
            navigate('/app/companies', { replace: true });
            onClose();
        }
    }, [deleteResponse, dispatch, navigate, onClose, showNotification, onAfterSubmit]);

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
                name='company'
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
                        <ScrollableView.Header className='company-form-header'>
                            <div className='company-form-header__title'>
                                {formTitle}
                            </div>
                            <div className='company-form-header__controls'>
                                <LoadingOutlined className={`company-form-header__throbber ${isLoading ? '' : 'hidden'}`} />
                                <Popconfirm
                                    title='Delete Company?'
                                    onConfirm={deleteCompanyAction}
                                    okText='Delete'
                                    cancelText='Cancel'
                                >
                                    <Button danger>Delete</Button>
                                </Popconfirm>
                                <Button type='primary' onClick={handleDrawerSubmit}>Save</Button>
                                <Button type='text' icon={<IconClose />} onClick={closeForm} className='custom-drawer__close-button' />
                            </div>
                        </ScrollableView.Header>
                        <ScrollableView.Body className='company-form'>
                            <div className='company-form__body'>
                                <SharedSectionNotes id='notes' />
                                <SharedSectionContacts id='contacts' form={form} />
                                <SharedSectionSocialMedia id='social-media' form={form} />
                                <SharedSectionAddresses id='addresses' />
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
}

export default CompanyForm;
