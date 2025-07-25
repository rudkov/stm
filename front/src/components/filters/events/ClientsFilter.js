import '../Filter.css';
import './ClientsFilter.css';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input } from 'antd';

import { getCompanies, fetchCompanies, filterCompanies } from '../../../store/companies/companies';

import Filter from '../Filter';

import { ReactComponent as IconCheckSmall } from '../../../assets/icons/check-small.svg';

function ClientsFilter(props) {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const fetchedCompanies = useSelector(getCompanies);
    const [companies, setCompanies] = useState([]);
    const [query, setQuery] = useState({
        searchString: sessionStorage.getItem('eventsPage.clientsFilter.query.searchString') ?? '',
    });

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    useEffect(() => {
        setCompanies(filterCompanies([...fetchedCompanies], query));
    }, [fetchedCompanies, query]);

    const toggleItem = (item) => {
        let items = [...props.selectedItems];
        const index = items.indexOf(item);
        index === -1 ? items.push(item) : items.splice(index, 1);
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredClients', JSON.stringify(items));
    }

    const clearFilter = (item) => {
        const items = [];
        props.setFiltered(items);
        sessionStorage.setItem('eventsPage.filteredClients', JSON.stringify(items));
    }

    const searchClients = (item) => {
        setQuery({ searchString: item.search });
        sessionStorage.setItem('eventsPage.clientsFilter.query.searchString', item.search);
    }

    let result = null;

    if (companies && Object.keys(companies).length > 0) {
        result = companies.map((company, index) => {
            return (
                <div
                    className='filter__checkbox-item clients-filter__checkbox-item'
                    key={'filter.clients.' + company.id}
                    onClick={toggleItem.bind(this, company.id)}
                >
                    <div className='filter__checkbox'>
                        {
                            props.selectedItems?.includes(company.id)
                            ? <div className='filter__check'><IconCheckSmall /></div>
                            : ''
                        }
                    </div>
                    <div className='clients-filter__checkbox-name'>{company.name}</div>
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
