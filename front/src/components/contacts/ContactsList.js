import './ContactsList.css';
import '../../helpers/shared.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Button, Form, Input, Space } from 'antd';

import { getContacts, fetchContacts, sortContacts, filterContacts } from '../../store/contacts/contacts';

import TableHeaderCell from '../ui-components/TableHeaderCell';

import { ReactComponent as IconSearch } from '../../assets/icons/search.svg';

function ContactsList() {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedContacts = useSelector(getContacts);
    const [contacts, setContacts] = useState([]);
    const [order, setOrder] = useState({
        column: sessionStorage.getItem('contactsPage.order.column') ?? 'name',
        asc: JSON.parse(sessionStorage.getItem('contactsPage.order.asc')) ?? true,
    });
    const [query, setQuery] = useState({
        searchString: sessionStorage.getItem('contactsPage.query.searchString') ?? '',
    });

    useEffect(() => {
        dispatch(fetchContacts());
    }, [dispatch]);

    useEffect(() => {
        setContacts(sortContacts(filterContacts([...fetchedContacts], query), order));
    }, [fetchedContacts, order, query]);

    const sortBy = (column) => {
        const newAsc = column === order.column ? !order.asc : true;
        setOrder({ column: column, asc: newAsc });
        sessionStorage.setItem('contactsPage.order.column', column);
        sessionStorage.setItem('contactsPage.order.asc', JSON.stringify(newAsc));
    }

    const search = (item) => {
        setQuery({ searchString: item.search });
        sessionStorage.setItem('contactsPage.query.searchString', item.search);
    }

    const resetFilters = () => {
        form.setFieldsValue({ search: '' });
        setQuery({ searchString: '' });
        sessionStorage.removeItem('contactsPage.query.searchString');
    }

    let result = null;

    if (contacts && Object.keys(contacts).length > 0) {

        result = contacts.map((contact, index) => {
            return (
                <NavLink key={'contact.' + contact.id} to={contact.id}>
                    <div className='contacts-table--row-container contacts-table--row text-regular'>
                        <div>{contact.name}</div>
                        <div>{contact.company_name}</div>
                        <div>{contact.job_title}</div>
                        <div>{contact.email}</div>
                        <div>{contact.phone}</div>
                    </div>
                </NavLink>
            );
        });
    }

    return (
        <div className='contacts-list'>

            <div className='contacts-header--container'>
                <div className='contacts-header--left'>
                    <Space wrap>
                        <Form
                            form={form}
                            initialValues={{ search: query.searchString }}
                            onValuesChange={search}
                            autoComplete='off'
                        >
                            <Form.Item name='search' noStyle={true}>
                                <Input placeholder="Search" allowClear={true} prefix={<IconSearch />} className='input--contained' />
                            </Form.Item>
                        </Form>
                        <Button onClick={resetFilters}>Reset Filters</Button>
                    </Space>
                </div>
                <div className='contacts-header--right'>
                    <NavLink to='new'>
                        <Button type="primary" className={`button--primary`}>Create Contact</Button>
                    </NavLink>
                </div>
            </div>

            <div className='contacts-table--table'>
                <div className='contacts-table--row-container contacts-table--header text-small text-light'>
                    <TableHeaderCell text='Name' onClick={sortBy} sortColumn='name' order={order} />
                    <TableHeaderCell text='Company' onClick={sortBy} sortColumn='company' order={order} />
                    <TableHeaderCell text='Job' onClick={sortBy} sortColumn='job' order={order} />
                    <TableHeaderCell text='Email' onClick={sortBy} sortColumn='email' order={order} />
                    <TableHeaderCell text='Phone' onClick={sortBy} sortColumn='phone' order={order} />
                </div>
                {result}
            </div>

        </div>
    );
}

export default ContactsList;