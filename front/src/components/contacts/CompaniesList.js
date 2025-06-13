import './CompaniesList.css';
import '../../helpers/shared.css';

import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router';
import { Button, Empty, Form, Input } from 'antd';

import { getCompanies, filterCompanies } from '../../store/contacts/companies';

import ScrollableView from '../ui-components/ScrollableView';

import { ReactComponent as IconAdd } from '../../assets/icons/add.svg';

function CompaniesList({ createCompany, filters, updateFilter }) {
    const [form] = Form.useForm();
    const fetchedCompanies = useSelector(getCompanies);
    const [companies, setCompanies] = useState([]);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        setCompanies(
            filterCompanies(
                [...fetchedCompanies],
                {
                    searchString: filters.search
                }
            )
        );
    }, [fetchedCompanies, filters.search]);

    const searchCompanies = (item) => {
        updateFilter('search', item.search);
    }

    let result = null;

    if (companies && Object.keys(companies).length > 0) {
        result = companies.map((company) => {
            return (
                <NavLink className='companies-list__item' key={'company.' + company.id} to={company.id}>
                    {company.name}
                </NavLink>
            );
        });
    }
    else {
        result = (
            <div className='companies-list__empty'>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No companies found' />
            </div>
        );
    }

    return (
        <div className='companies-list'>
            <ScrollableView scrollContainerRef={scrollContainerRef} className='companies-list__section section-primary'>
                <ScrollableView.Header className='companies-list__header'>
                    <Form
                        form={form}
                        name='talents.search.form'
                        initialValues={{ search: filters.search }}
                        onValuesChange={searchCompanies}
                        autoComplete='off'
                    >
                        <Form.Item name='search'>
                            <Input
                                placeholder='Search'
                                allowClear={true}
                            />
                        </Form.Item>
                    </Form>
                    <Button type='primary' icon={<IconAdd />} onClick={createCompany} />
                </ScrollableView.Header>
                <ScrollableView.Body className='companies-list__body'>
                    {result}
                </ScrollableView.Body>
            </ScrollableView>
        </div>
    );
}

export default CompaniesList;