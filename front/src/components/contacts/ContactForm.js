import { useCallback, useState, useRef } from 'react';

import { Modal, Radio } from 'antd';

import BaseForm from 'components/ui-components/BaseForm';

import {
    useGetContactQuery,
    useCreateContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation,
} from 'api/contacts/contactsApi';

import {
    initAddresses, processAddresses,
    initCompanies, processCompanies,
    initEmails, processEmails,
    initMessengers, processMessengers,
    initPhones, processPhones,
    initSocialMedias, processSocialMedias,
    initWeblinks, processWeblinks
} from 'helpers/form-utils';

import SharedSectionAddresses from 'components/nested-sections/shared/edit/SharedSectionAddresses';
import SharedSectionEmails from 'components/nested-sections/shared/edit/SharedSectionEmails';
import SharedSectionMessengers from 'components/nested-sections/shared/edit/SharedSectionMessengers';
import SharedSectionPhones from 'components/nested-sections/shared/edit/SharedSectionPhones';
import SharedSectionSocialMedia from 'components/nested-sections/shared/edit/SharedSectionSocialMedia';
import SharedSectionWeblinks from 'components/nested-sections/shared/edit/SharedSectionWeblinks';

import ContactSectionCompanies from 'components/nested-sections/contacts/edit/ContactSectionCompanies';
import ContactSectionPrimaryInfo from 'components/nested-sections/contacts/edit/ContactSectionPrimaryInfo';

const extractCompanyIds = (companies = []) =>
    companies?.map((c) => c?.company_id ?? c?.id ?? null).filter((id) => id !== null && id !== undefined);

function ContactForm({ isFormOpen, onClose, onAfterSubmit, companyId, contactId }) {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteAction, setDeleteAction] = useState(null);
    const [contact, setContact] = useState(null);
    const [triggerUpdate] = useUpdateContactMutation();
    const [redirectUrlAfterCreate, setRedirectUrlAfterCreate] = useState();
    const [redirectUrlAfterDelete, setRedirectUrlAfterDelete] = useState();
    const deleteResolverRef = useRef(null);

    const onInitForm = useCallback((values, form) => {
        // Pre-fill the companies list when creating a new contact directly from a company page
        const initValues = { ...values };

        if ((!initValues.companies || initValues.companies.length === 0) && companyId) {
            setRedirectUrlAfterCreate(null);
            initValues.companies = [{ id: companyId, job_title: '' }];
        }

        form.setFieldsValue({
            first_name: initValues.first_name || '',
            last_name: initValues.last_name || '',
            notes: initValues.notes || '',
            job_title: initValues.job_title || '',

            ...initAddresses(initValues),
            ...initCompanies(initValues),
            ...initEmails(initValues),
            ...initMessengers(initValues),
            ...initPhones(initValues),
            ...initSocialMedias(initValues),
            ...initWeblinks(initValues),
        });
    }, [companyId]);

    const onProcessFormData = useCallback((values) => ({
        ...values,
        ...processAddresses(values),
        ...processCompanies(values),
        ...processEmails(values),
        ...processMessengers(values),
        ...processPhones(values),
        ...processSocialMedias(values),
        ...processWeblinks(values)
    }), []);

    const getTitle = useCallback((entity, isNew) => {
        if (isNew) {
            return 'New Contact';
        }
        return entity?.first_name + ' ' + entity?.last_name || 'Edit Contact';
    }, []);

    const getDeleteConfirmationText = useCallback((entity) => {
        return `Delete ${entity?.first_name + ' ' + entity?.last_name || 'contact'}?`;
    }, []);

    const getExtraArgs = useCallback(({ values, originalEntity }) => {
        const formIds = extractCompanyIds(values?.companies);
        const originalIds = extractCompanyIds(originalEntity?.companies);

        const companyIds = Array.from(new Set([...originalIds, ...formIds]));

        return { companyIds };
    }, []);

    const customDeleteConfirm = useCallback((entity) => {
        return new Promise((resolve) => {
            deleteResolverRef.current = resolve;
            setContact(entity);
            setIsDeleteModalOpen(true);
        });
    }, []);

    const onModalRadioChange = (e) => {
        setDeleteAction(e.target.value);
    };

    const onModalProceed = async () => {
        if (deleteAction === 'unlink') {
            if (!contact) return;

            const updatedCompanies = contact.companies.filter((c) => c.id !== companyId);

            const values = onProcessFormData({
                ...contact,
                companies: updatedCompanies,
            });

            const companyIds = [...updatedCompanies.map((c) => c.id), companyId];

            await triggerUpdate({ id: contact.id, values, companyIds });
            setRedirectUrlAfterDelete(null);
            deleteResolverRef.current?.(false);
        } else if (deleteAction === 'delete') {
            setRedirectUrlAfterDelete(null);
            deleteResolverRef.current?.(true);
        }
        setIsDeleteModalOpen(false);
        setDeleteAction(null);
        onClose();
    };

    const onModalCancel = () => {
        deleteResolverRef.current?.(false);
        setIsDeleteModalOpen(false);
        setDeleteAction(null);
    };

    return (
        <>
            <BaseForm
                entityId={contactId}
                entityName='contact'
                entityUrl='/app/contacts'

                enableDelete={true}
                enableAnchorNavigation={false}
                formWidth={600}

                apiActions={{
                    query: useGetContactQuery,
                    create: useCreateContactMutation,
                    update: useUpdateContactMutation,
                    delete: useDeleteContactMutation,
                }}

                onInitForm={onInitForm}
                onProcessFormData={onProcessFormData}
                getTitle={getTitle}
                getDeleteConfirmationText={getDeleteConfirmationText}
                customDeleteConfirm={customDeleteConfirm}
                getExtraArgs={getExtraArgs}
                redirectUrlAfterCreate={redirectUrlAfterCreate}
                redirectUrlAfterDelete={redirectUrlAfterDelete}
                open={isFormOpen}
                onClose={onClose}
                onAfterSubmit={onAfterSubmit}
            >
                <ContactSectionPrimaryInfo id='primary-info' />
                <ContactSectionCompanies id='companies' />
                <SharedSectionEmails id='emails' />
                <SharedSectionPhones id='phones' />
                <SharedSectionMessengers id='messengers' />
                <SharedSectionSocialMedia id='social-media' />
                <SharedSectionWeblinks id='weblinks' />
                <SharedSectionAddresses id='addresses' />
            </BaseForm>

            <Modal
                title='What do you want to do?'
                closable={true}
                open={isDeleteModalOpen}
                zIndex={2000}
                onOk={onModalProceed}
                onCancel={onModalCancel}
                okText='Proceed'
                okButtonProps={{ danger: true }}
            >
                {contact?.companies?.length > 0 && (
                    <>
                        <p>{contact?.first_name} {contact?.last_name} is linked to the following companies:</p>
                        <ul>
                            {contact.companies.map((c) => (
                                <li key={c.id}>{c.name}</li>
                            ))}
                        </ul>
                    </>
                )}

                <p>
                    <b>Please specify your action:</b>
                </p>

                <Radio.Group
                    onChange={onModalRadioChange}
                    options={[
                        { value: 'unlink', label: 'Remove from "' + contact?.companies?.find((c) => c.id === companyId)?.name + '" only' },
                        { value: 'delete', label: 'Delete entirely and remove from all companies' },
                    ]}
                />
            </Modal >
        </>
    );
}

export default ContactForm;
