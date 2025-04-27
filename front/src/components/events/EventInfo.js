import './EventInfo.css';
import '../../helpers/form.css';

import { useParams, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

import { Form, Select, DatePicker, Button, Drawer } from 'antd';


import { eventActions, getEvent, fetchEventById } from '../../store/events/event';
import { fetchEvents } from '../../store/events/events';

import { useNotification } from '../notifications/NotificationProvider';

import TimePicker from './TimePicker';
import dayjs from 'dayjs';

import EventSectionMain from './sections/EventSectionMain';
import EventSectionNotes from './sections/EventSectionNotes';
import EventSectionTalents from './sections/EventSectionTalents';
import EventSectionChunks from './sections/EventSectionChunks';
import EventSectionClient from './sections/EventSectionClient';
import EventSectionSystemInfo from './sections/EventSectionSystemInfo';

import TalentProfile from '../talents/TalentProfile';

function EventInfo(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [form] = Form.useForm();
    const showNotification = useNotification();

    const event = useSelector(getEvent);
    // const createResponse = useSelector(getCreateResponse);
    // const updateResponse = useSelector(getUpdateResponse);
    // const deleteResponse = useSelector(getDeleteResponse);

    const [editMode, setEditMode] = useState(props.newEvent ? true : false);
    const [eventId, setEventId] = useState(null);
    const [loading, setLoading] = useState(false);

    const toggleForm = () => {
        setEditMode(!editMode);
    };

    const initForm = () => {
        console.log(event);
        form.setFieldsValue({
            title: event.title || '',
            event_type_id: event.event_type_id,
            notes: event.notes || '',

            talents: event.talents || null,
        });
    };

    const handleCancel = () => {
        form.resetFields();
        initForm();
        toggleForm();

        if (props.newContact) {
            navigate('/app/contacts', { replace: true });
        }
    };

    // const handleSave = () => {
    //   form.submit();
    // };

    // const handleDelete = () => {
    //   dispatch(deleteContactById({ contactId: contact.id }));
    // };

    // const onFinishFailed = (errorInfo) => {
    //   console.log('Failed:', errorInfo);
    // };

    // const onFormSubmit = (values) => {
    //   setLoading(true);

    //   if (props.newContact) {
    //     dispatch(createContact({ values: values }));
    //   }
    //   else {
    //     console.log(values);
    //     dispatch(updateContactById({ contactId: contact.id, values: values }));
    //   }
    // };

    // useEffect(() => {
    //   if (props.newEvent) {
    //     dispatch(eventActions.resetState());
    //     setEditMode(true);
    //   }
    //   else {
    //     setEditMode(false);
    //   }
    // }, [params, dispatch]);

    useEffect(() => {
        if (params.id && eventId !== params.id) {
            dispatch(fetchEventById(params.id));
        }
        setEventId(params.id);

    }, [eventId, params.id, dispatch]);

    useEffect(() => {
        initForm();
    }, [event, form]);

    // useEffect(() => {
    //   setLoading(false);
    //   if (createResponse.status === 'fulfilled') {
    //     showNotification({ type: "SUCCESS", message: "Event created" });
    //     dispatch(fetchEvents());
    //     toggleForm();
    //     dispatch(eventActions.resetResponse('create'));
    //     navigate('/app/calendar/' + createResponse.eventId, { replace: true });
    //   }
    // }, [createResponse]);

    // useEffect(() => {
    //     setLoading(false);
    //     if (updateResponse.status === 'fulfilled') {
    //         showNotification({ type: "SUCCESS", message: "Changes saved" });
    //         dispatch(fetchEvents());
    //         toggleForm();
    //         dispatch(eventActions.resetResponse('update'));
    //     }
    // }, [updateResponse]);

    // useEffect(() => {
    //     setLoading(false);
    //     if (deleteResponse.status === 'fulfilled') {
    //         showNotification({ type: "SUCCESS", message: "Event deleted" });
    //         dispatch(fetchEvents());
    //         toggleForm();
    //         dispatch(eventActions.resetResponse('delete'));
    //         navigate('/app/calendar', { replace: true });
    //     }
    // }, [deleteResponse]);

    const [talentInfoOpen, setTalentInfoOpen] = useState(false);
    const [talentInfoId, setTalentInfoId] = useState(false);

    const showTalentInfo = (item) => {
        setTalentInfoOpen(true);
        setTalentInfoId(item);
    };
    const closeTalentInfo = () => {
        setTalentInfoOpen(false);
    };

    let result = null;

    if (event && Object.getPrototypeOf(event) === Object.prototype) {
        result =
            <div className='info-panel'>
                <EventSectionMain
                    editMode={editMode}
                    handleCancel={handleCancel}
                    // handleSave={handleSave}
                    toggleForm={toggleForm}
                    // deleteEvent={handleDelete}
                    loading={loading}
                    isNewEvent={props.newEvent}
                />
                <EventSectionNotes editMode={editMode} />
                <EventSectionTalents editMode={editMode} showTalentInfo={showTalentInfo} />
                <EventSectionChunks editMode={editMode} />
                <EventSectionClient editMode={editMode} />
                {props.newEvent ? '' : <EventSectionSystemInfo />}
            </div>;
    }

    return (
        <>
            <Form
                name="event"
                form={form}
                // onFinish={onFormSubmit}
                // onFinishFailed={onFinishFailed}
                preserve={true}
            >
                {result}
            </Form>
            <Drawer
                closable={false}
                onClose={closeTalentInfo}
                open={talentInfoOpen}
                width={600}
            >
                <TalentProfile talentId={talentInfoId} />
            </Drawer>
        </>
    );
}

export default EventInfo;