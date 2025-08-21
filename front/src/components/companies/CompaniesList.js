import './CompaniesList.css';
import 'helpers/shared.css';

import { useMemo, useRef } from 'react';
import { NavLink } from 'react-router';
import { Button, Empty, Form, Input } from 'antd';

import { useGetCompaniesQuery } from 'api/companies/companiesApi';
import { applyLocalFilters } from 'components/filters/companies/applyLocalFilters';

import ScrollableView from 'components/ui-components/ScrollableView';

import { ReactComponent as IconAdd } from 'assets/icons/add.svg';

function CompaniesList({ createCompany, filters, updateFilter }) {
    const [form] = Form.useForm();
    const scrollContainerRef = useRef(null);
    const { data: fetchedCompanies = [] } = useGetCompaniesQuery(filters);

    const companies = useMemo(() => {
        return applyLocalFilters(
            [...fetchedCompanies],
            {
                searchString: filters.search,
                managers: filters.managers
            }
        );
    }, [fetchedCompanies, filters.search, filters.managers]);

    const searchCompanies = (item) => {
        updateFilter('search', item.search);
    }

    let result = null;

    if (companies && companies.length > 0) {
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
                        name='companies.search.form'
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
