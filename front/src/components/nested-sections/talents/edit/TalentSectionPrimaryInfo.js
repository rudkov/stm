import { DatePicker, Form, Input, Select, Radio } from 'antd';
import { useEffect, useState } from 'react';

import { useGetTalentBoardsQuery, useCreateTalentBoardMutation } from 'api/talents/talentBoardsApi';
import { useGetCompaniesQuery } from 'api/companies/companiesApi';
import { useGetUsersQuery } from 'api/usersApi';

import { useSettings } from 'context/SettingsContext';

import CustomSelect from 'components/ui-components/CustomSelect';
import NestedSection from 'components/nested-sections/NestedSection';

const lifestyleOrFashion = [
    {
        value: 'Lifestyle',
        label: 'Lifestyle'
    },
    {
        value: 'Fashion',
        label: 'Fashion'
    },
];

function TalentSectionPrimaryInfo(props) {
    const { settings } = useSettings();
    const outputDateFormat = 'DD.MM.YYYY'; //TODO: move to settings
    const [isAddBoardInputOpen, setIsAddBoardInputOpen] = useState(false);

    const { data: boards = [] } = useGetTalentBoardsQuery();
    const [createBoard, { data: newBoard, isLoading: isCreateBoardLoading, isSuccess: isCreateBoardSuccess }] = useCreateTalentBoardMutation();

    const { data: companies = [] } = useGetCompaniesQuery();
    const { data: managers = [] } = useGetUsersQuery();

    const handleAddBoard = (boardName) => {
        createBoard({ values: { name: boardName } });
    };

    useEffect(() => {
        if (isCreateBoardSuccess) {
            props.form.setFieldsValue({ board_id: newBoard.id });
            setIsAddBoardInputOpen(false);
        }
    }, [isCreateBoardSuccess, newBoard, props.form]);

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='base-form-row__left-label' label='First name' name='first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Last name' name='last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Legal first name' name='legal_first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Legal last name' name='legal_last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Birth date' name='birth_date'>
                    <DatePicker format={outputDateFormat} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Gender' name='gender_id'>
                    <Select
                        allowClear
                        options={settings.talent_genders.map(item => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Marital status' name='marital_status_id'>
                    <Select
                        allowClear
                        options={settings.talent_marital_statuses.map(item => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Lifestyle/fashion' name='is_lifestyle'>
                    <Radio.Group options={lifestyleOrFashion} />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Mother agency' name='mother_agency_id'>
                    <Select
                        allowClear
                        options={companies.map((item) => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Board' name='board_id'>
                    <CustomSelect
                        open={isAddBoardInputOpen}
                        onDropdownVisibleChange={setIsAddBoardInputOpen}
                        options={boards.map((item) => ({ label: item.name, value: item.id }))}
                        onAddItem={handleAddBoard}
                        inputPlaceholder='Enter new board name'
                        addButtonText='Add Board'
                        isAddInputLoading={isCreateBoardLoading}
                    />
                </Form.Item>
                <Form.Item className='base-form-row__left-label' label='Manager' name='manager_id'>
                    <Select options={managers.map(item => ({ label: item.name, value: item.id }))} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPrimaryInfo;
