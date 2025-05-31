import './Filter.css';
import './ClientsFilter.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';

import { getClients, fetchClients, filterClients } from '../../store/clients/clients';

import Filter from './Filter';

import { ReactComponent as IconCheckSmall } from '../../assets/icons/check-small.svg';

function ClientsFilter(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedClients = useSelector(getClients);
    const [clients, setClients] = useState([]);
    const [query, setQuery] = useState({
        searchString: sessionStorage.getItem('eventsPage.clientsFilter.query.searchString') ?? '',
    });

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    useEffect(() => {
        setClients(filterClients([...fetchedClients], query));
    }, [fetchedClients, query]);

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.findIndex(client =>
            client.id === item.id && client.type === item.type
        );
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredClients', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const clients = [];
        props.setFiltered(clients);
        sessionStorage.setItem('eventsPage.filteredClients', JSON.stringify(clients));
    }

    const searchClients = (item) => {
        setQuery({ searchString: item.search });
        sessionStorage.setItem('eventsPage.clientsFilter.query.searchString', item.search);
    }

    let result = null;

    if (clients && Object.keys(clients).length > 0) {
        result = clients.map((client, index) => {
            return (
                <div
                    className='filter__checkbox-item clients-filter__checkbox-item'
                    key={'filter.clients.' + client.id}
                    onClick={toggleItem.bind(this, { id: client.id, type: client.type })}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.some(item => item.id === client.id && item.type === client.type)
                                ? <div className='filter__check'><IconCheckSmall /></div>
                                : ''
                        }
                    </div>
                    <div className='clients-filter__checkbox-name'>{client.name}</div>
                </div>
            );
        });
    }

    return (
        <Filter
            title='Clients'
            uniqueName={props.uniqueName}
            applied={props.selectedItems && Object.keys(props.selectedItems).length > 0}
            clearFilter={clearFilter}
        >
            <div className='clients-filter'>
                <Form
                    form={form}
                    initialValues={{ search: query.searchString }}
                    onValuesChange={searchClients}
                    autoComplete='off'
                >
                    <Form.Item name='search'>
                        <Input
                            placeholder='Search'
                            allowClear={true}
                        />
                    </Form.Item>
                </Form>
                <div className='clients-filter__clients-list'>
                    {result}
                </div>
            </div>
        </Filter>
    );
}

export default ClientsFilter;
