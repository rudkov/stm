import './ContactProfile.css';
import '../../helpers/shared.css';

import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useCallback } from 'react';

import { Form } from 'antd';

import { contactActions, getContact, fetchContactById, updateContactById, getUpdateResponse, createContact, getCreateResponse, deleteContactById, getDeleteResponse } from '../../store/contacts/contact';
import { fetchContacts } from '../../store/contacts/contacts';

import ContactSectionMain from './sections/ContactSectionMain';
import ContactSectionCompanies from './sections/ContactSectionCompanies';
import ContactSectionNotes from './sections/ContactSectionNotes';
import ContactSectionPhones from './sections/ContactSectionPhones';
import ContactSectionEmails from './sections/ContactSectionEmails';
import ContactSectionMessengers from './sections/ContactSectionMessengers';
import ContactSectionSystemInfo from './sections/ContactSectionSystemInfo';

import { useNotification } from '../notifications/NotificationProvider';

function ContactProfile(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const showNotification = useNotification();

    const contact = useSelector(getContact);
    const createResponse = useSelector(getCreateResponse);
    const updateResponse = useSelector(getUpdateResponse);
    const deleteResponse = useSelector(getDeleteResponse);

    const [editMode, setEditMode] = useState(props.newContact ? true : false);
    const [contactId, setContactId] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleForm = useCallback(() => {
        setEditMode(!editMode);
    }, [editMode]);

    const initForm = useCallback(() => {
        // console.log(contact);
        form.setFieldsValue({
            first_name: contact.first_name || '',
            last_name: contact.last_name || '',
            comment: contact.comment || '',
            
            companies: contact.companies || null,

            phones: contact.phones || null,
            emails: contact.emails || null,
            messengers: contact.messengers || null,
        });
    }, [contact, form]);

    const handleCancel = () => {
        form.resetFields();
        initForm();
        toggleForm();

        if (props.newContact) {
            navigate('/app/contacts', { replace: true });
        }
    };

    const handleSave = () => {
        form.submit();
    };

    const handleDelete = () => {
        dispatch(deleteContactById({ contactId: contact.id }));
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFormSubmit = (values) => {
        setLoading(true);

        if (props.newContact) {
            dispatch(createContact({ values: values }));
        }
        else {
            console.log(values);
            dispatch(updateContactById({ contactId: contact.id, values: values }));
        }
    };

    useEffect(() => {
        if (props.newContact) {
            dispatch(contactActions.resetState());
            setEditMode(true);
        }
        else {
            setEditMode(false);
        }
    }, [params, dispatch, props.newContact]);

    useEffect(() => {
        if (params.id && contactId !== params.id) {
            dispatch(fetchContactById(params.id));
        }
        setContactId(params.id);

    }, [contactId, params.id, dispatch]);

    useEffect(() => {
        initForm();
    }, [contact, form, initForm]);

    useEffect(() => {
        setLoading(false);
        if (createResponse.status === 'fulfilled') {
            showNotification({ type: "SUCCESS", message: "Contact created" });
            dispatch(fetchContacts());
            toggleForm();
            dispatch(contactActions.resetResponse('create'));
            navigate('/app/contacts/' + createResponse.contactId, { replace: true });
        }
    }, [createResponse, dispatch, navigate, showNotification, toggleForm]);

    useEffect(() => {
        setLoading(false);
        if (updateResponse.status === 'fulfilled') {
            showNotification({ type: "SUCCESS", message: "Changes saved" });
            dispatch(fetchContacts());
            toggleForm();
            dispatch(contactActions.resetResponse('update'));
        }
    }, [updateResponse, dispatch, navigate, showNotification, toggleForm]);

    useEffect(() => {
        setLoading(false);
        if (deleteResponse.status === 'fulfilled') {
            showNotification({ type: "SUCCESS", message: "Contact deleted" });
            dispatch(fetchContacts());
            toggleForm();
            dispatch(contactActions.resetResponse('delete'));
            navigate('/app/contacts', { replace: true });
        }
    }, [deleteResponse, dispatch, navigate, showNotification, toggleForm]);

    let result = null;

    if (contact && Object.getPrototypeOf(contact) === Object.prototype) {
        result =
            <div className='info-panel contact-profile'>
                <ContactSectionMain
                    editMode={editMode}
                    handleCancel={handleCancel}
                    handleSave={handleSave}
                    toggleForm={toggleForm}
                    deleteContact={handleDelete}
                    loading={loading}
                    isNewContact={props.newContact}
                />
                <ContactSectionCompanies editMode={editMode} />
                <ContactSectionNotes editMode={editMode} />
                <ContactSectionEmails editMode={editMode} />
                <ContactSectionPhones editMode={editMode} />
                <ContactSectionMessengers editMode={editMode} />
                {props.newContact ? '' : <ContactSectionSystemInfo />}
            </div>;
    }

    return (
        <Form
            name="contact"
            form={form}
            onFinish={onFormSubmit}
            onFinishFailed={onFinishFailed}
            preserve={true}
        >
            {result}
        </Form>
    );
}

export default ContactProfile;