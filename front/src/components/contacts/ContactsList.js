import './ContactsList.css';
import '../../helpers/shared.css';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Button, Empty, Form, Input } from 'antd';

import { getContacts, filterContacts } from '../../store/contacts/contacts';

import ScrollableView from '../ui-components/ScrollableView';

import { ReactComponent as IconAdd } from '../../assets/icons/add.svg';

function ContactsList({ createContact, filters, updateFilter }) {
    const [form] = Form.useForm();
    const fetchedContacts = useSelector(getContacts);
    const [contacts, setContacts] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setContacts(
            filterContacts(
                [...fetchedContacts],
                {
                    searchString: filters.search
                }
            )
        );
    }, [fetchedContacts, filters.search]);

    const searchContacts = (item) => {
        updateFilter('search', item.search);
    }

    let result = null;

    if (contacts && Object.keys(contacts).length > 0) {
        result = contacts.map((contact) => {
            return (
                <NavLink className='contacts-list__item' key={'contact.' + contact.id} to={contact.id}>
                    {contact.name}
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