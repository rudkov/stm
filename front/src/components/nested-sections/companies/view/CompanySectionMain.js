import './CompanySectionMain.css';

import { useState, useEffect } from 'react';
import { Button, Dropdown, Modal, Form, Input, Select } from 'antd';

import { useGetContactsQuery } from 'api/contacts/contactsApi';
import { useUpdateCompanyMutation } from 'api/companies/companiesApi';

import ContactListItem from 'components/contacts/components/ContactListItem';

import { ReactComponent as IconClose } from 'assets/icons/close.svg';

function CompanySectionMain({ data, editNote, editCompany, editContact }) {
    const company = data;
    const [isAddExistingContactModalOpen, setIsAddExistingContactModalOpen] = useState(false);
    const [form] = Form.useForm();
    const { data: contacts = [] } = useGetContactsQuery();

    // Contacts already linked to this company – used to filter the dropdown options
    const linkedContactIds = new Set((company.contacts || []).map((c) => c.id));

    // Options for the Select control: contacts that are not yet linked
    const contactOptions = contacts
        .filter((contact) => !linkedContactIds.has(contact.id))
        .map((contact) => ({
            value: contact.id,
            label: contact.name,
            original: contact,
        }));

    console.log(contactOptions);

    const [updateCompany, { isSuccess }] = useUpdateCompanyMutation();

    const handleContactDropdownItemClick = (e) => {
        if (e.key === 'add-existing') {
            form.resetFields();
            setIsAddExistingContactModalOpen(true);
        }
    };

    const addContactDropdownProps = {
        items: [
            { label: 'Link Existing Contact', key: 'add-existing' },
        ],
        onClick: handleContactDropdownItemClick,
    };

    const handleAddExistingContactModalOk = () => {
        form.submit();
    };

    const handleAddExistingContactModalCancel = () => {
        setIsAddExistingContactModalOpen(false);
    };

    const handleAddExistingContactFormSubmit = (values) => {
        const { id: selectedId, job_title } = values;

        // Build minimal objects for already-linked contacts – include job_title only if exists
        const processedContacts = (company.contacts || []).map((c) => {
            const pivotJobTitle = c.companies?.find((cmp) => cmp.id === company.id)?.job_title ?? null;
            return { id: c.id, job_title: pivotJobTitle };
        });

        processedContacts.push({ id: selectedId, job_title: job_title ?? null });

        updateCompany({ id: company.id, values: { contacts: processedContacts } });
    };

    useEffect(() => {
        if (isSuccess) {
            setIsAddExistingContactModalOpen(false);
            form.resetFields();
        }
    }, [isSuccess, form]);

    return (
        <>
            <div className='company-section-main'>
                <div className='company-section-main__header'>
                    <div className='company-section-main__company-name'>{company.name}</div>
                </div>
                <div className='company-section-main__controls'>
                    {editNote && (<Button onClick={() => editNote(company.id)}>Add Note</Button>)}
                    {editContact && (
                        <Dropdown.Button
                            menu={addContactDropdownProps}
                            onClick={() => editContact(company.id, null)}
                        >
                            Add Contact
                        </Dropdown.Button>
                    )}
                    {editCompany && (<Button onClick={() => editCompany(company.id)}>Edit Company</Button>)}
                </div>
            </div>

            <Modal
                title='Link Existing Contact'
                closable={true}
                closeIcon={<IconClose />}
                open={isAddExistingContactModalOpen}
                zIndex={2000}
                onOk={handleAddExistingContactModalOk}
                onCancel={handleAddExistingContactModalCancel}
                okText='Link Contact'
            >
                <Form
                    name='add-existing-contact-to-company-form'
                    className='company-section-main__modal-form'
                    form={form}
                    onFinish={handleAddExistingContactFormSubmit}
                    preserve={false}
                >
                    <Form.Item name='id'>
                        <Select
                            placeholder='Contact'
                            options={contactOptions}
                            optionRender={option => <ContactListItem contact={option.data.original} />}
                        />
                    </Form.Item>
                    <Form.Item name='job_title'>
                        <Input placeholder='Job title' />
                    </Form.Item>
                </Form>
            </Modal >
        </>
    );
}

export default CompanySectionMain;
