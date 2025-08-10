import './TalentsList.css';
import 'helpers/shared.css';

import { useMemo, useRef } from 'react';
import { NavLink } from 'react-router';
import { Button, Empty, Form, Input, Tooltip } from 'antd';

import { useGetTalentsQuery } from 'api/talents/talentsApi';
import { applyLocalFilters } from 'components/filters/talents/applyLocalFilters';

import ScrollableView from 'components/ui-components/ScrollableView';
import TalentUsername from './components/TalentUsername';

import { ReactComponent as IconInTown } from 'assets/icons/in-town.svg';
import { ReactComponent as IconAdd } from 'assets/icons/add.svg';

function TalentsList({ createTalent, filters, updateFilter }) {
    const [form] = Form.useForm();
    const scrollContainerRef = useRef(null);
    const { data: fetchedTalents = [] } = useGetTalentsQuery(filters);

    const talents = useMemo(() => {
        return applyLocalFilters(
            [...fetchedTalents],
            {
                searchString: filters.search,
                locations: filters.locations,
                managers: filters.managers
            }
        );
    }, [fetchedTalents, filters.search, filters.locations, filters.managers]);

    const searchTalents = (item) => {
        updateFilter('search', item.search);
    }

    let result = null;

    if (talents && Object.keys(talents).length > 0) {
        result = talents.map((talent) => {
            return (
                <NavLink className='talents-list__item' key={'talent.' + talent.id} to={talent.id}>
                    <TalentUsername name={talent.name} />
                    <div className='talents-list__item-in-town'>
                        {
                            talent.location
                                ? ''
                                :
                                <Tooltip title='In town' placement='bottom' arrow={false} mouseEnterDelay={0.5}>
                                    <IconInTown />
                                </Tooltip>
                        }
                    </div>
                </NavLink>
            );
        });
    }
    else {
        result = (
            <div className='talents-list__empty'>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='No talents found' />
            </div>
        );
    }

    return (
        <div className='talents-list'>
            <ScrollableView scrollContainerRef={scrollContainerRef} className='talents-list__section section-primary'>
                <ScrollableView.Header className='talents-list__header'>
                    <Form
                        form={form}
                        name='talents.search.form'
                        initialValues={{ search: filters.search }}
                        onValuesChange={searchTalents}
                        autoComplete='off'
                    >
                        <Form.Item name='search'>
                            <Input
                                placeholder='Search'
                                allowClear={true}
                            />
                        </Form.Item>
                    </Form>
                    <Button type='primary' icon={<IconAdd />} onClick={createTalent} />
                </ScrollableView.Header>
                <ScrollableView.Body className='talents-list__body'>
                    {result}
                </ScrollableView.Body>
            </ScrollableView>
        </div>
    );
}

export default TalentsList;
