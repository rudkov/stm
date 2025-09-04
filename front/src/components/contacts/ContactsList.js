import './ContactsList.css';
import 'helpers/shared.css';

import { useMemo, useRef } from 'react';
import { NavLink } from 'react-router';
import { Button, Empty, Form, Input } from 'antd';

import { useGetContactsQuery } from 'api/contacts/contactsApi';
import { applyLocalFilters } from 'components/filters/contacts/applyLocalFilters';

import ScrollableView from 'components/ui-components/ScrollableView';
import ContactListItem from './components/ContactListItem';

import { ReactComponent as IconAdd } from 'assets/icons/add.svg';

function ContactsList({ createContact, filters, updateFilter }) {
    const [form] = Form.useForm();
    const scrollContainerRef = useRef(null);

    const { data: fetchedContacts = [] } = useGetContactsQuery(filters);

    const contacts = useMemo(() => {
        return applyLocalFilters(
            [...fetchedContacts],
            {
                searchString: filters.search
            }
        );
    }, [fetchedContacts, filters.search]);

    const searchContacts = (item) => {
        updateFilter('search', item.search);
    }

    let result = null;

    if (contacts && contacts.length > 0) {
        result = contacts.map((contact) => {
            return (
                <NavLink className='contacts-list__item' key={'contact.' + contact.id} to={contact.id}>
                    <ContactListItem contact={contact} />
                </NavLink>
            );
        });
    }
    else {
        result = (
            <div className='contacts-list__empty'>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No contacts found' />
            </div>
        );
    }

    return (
        <div className='contacts-list'>
            <ScrollableView scrollContainerRef={scrollContainerRef} className='contacts-list__section section-primary'>
                <ScrollableView.Header className='contacts-list__header'>
                    <Form
                        form={form}
                        name='contacts.search.form'
                        initialValues={{ search: filters.search }}
                        onValuesChange={searchContacts}
                        autoComplete='off'
                        style={{ width: '100%' }}
                    >
                        <Form.Item name='search'>
                            <Input
                                placeholder='Search'
                                allowClear={true}
                            />
                        </Form.Item>
                    </Form>
                    <Button type='primary' icon={<IconAdd />} onClick={createContact} />
                </ScrollableView.Header>
                <ScrollableView.Body className='contacts-list__body'>
                    {result}
                </ScrollableView.Body>
            </ScrollableView>
        </div>
    );
}

export default ContactsList;
