import { DatePicker, Form, Input, Select, Radio } from 'antd';
import { useEffect, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { createTalentBoard, getCreateResponse as getCreateTalentBoardResponse, talentBoardActions } from '../../../../store/talents/talentBoard';
import { fetchTalentBoards, getTalentBoards } from '../../../../store/talents/talentBoards';
import { fetchUsers, getUsers } from '../../../../store/users/users';

import { useSettings } from '../../../../context/SettingsContext';

import CustomSelect from '../../../ui-components/CustomSelect';
import NestedSection from '../../../ui-components/NestedSection';

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
    const outputDateFormat = 'DD.MM.YYYY';
    const dispatch = useDispatch();
    const fetchedUsers = useSelector(getUsers);
    const [managers, setManagers] = useState([]);
    const fetchedTalentBoards = useSelector(getTalentBoards);
    const [boards, setBoards] = useState([]);
    const createTalentBoardResponse = useSelector(getCreateTalentBoardResponse);
    const [isAddBoardInputOpen, setIsAddBoardInputOpen] = useState(false);
    const [isAddBoardInputLoading, setIsAddBoardInputLoading] = useState(false);

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchTalentBoards());
    }, [dispatch]);

    useEffect(() => {
        setManagers([...fetchedUsers]);
    }, [fetchedUsers]);

    useEffect(() => {
        setBoards([...fetchedTalentBoards]);
    }, [fetchedTalentBoards]);

    const handleAddBoard = (boardName) => {
        setIsAddBoardInputLoading(true);
        dispatch(createTalentBoard({ values: { name: boardName } }));
    };

    useEffect(() => {
        if (createTalentBoardResponse.status === 'fulfilled') {
            props.form.setFieldsValue({ board_id: createTalentBoardResponse.item.id });
            dispatch(fetchTalentBoards());
            dispatch(talentBoardActions.resetResponse('create'));
            setIsAddBoardInputLoading(false);
            setIsAddBoardInputOpen(false);
        }
    }, [createTalentBoardResponse, props.form, dispatch]);

    return (
        <NestedSection className={props.className} id={props.id}>
            <NestedSection.Header>Primary Info</NestedSection.Header>
            <NestedSection.Body className='nested-section__column'>
                <Form.Item className='talent-form-row__left-label' label='First name' name='first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Last name' name='last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Legal first name' name='legal_first_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Legal last name' name='legal_last_name'>
                    <Input />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Birth date' name='birth_date'>
                    <DatePicker format={outputDateFormat} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Gender' name='gender_id'>
                    <Select
                        allowClear
                        options={settings.talent_genders.map(item => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Marital status' name='marital_status_id'>
                    <Select
                        allowClear
                        options={settings.talent_marital_statuses.map(item => ({ label: item.name, value: item.id }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Lifestyle/fashion' name='is_lifestyle'>
                    <Radio.Group options={lifestyleOrFashion} />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Mother agency' name='mother_agency'>
                    <Select
                        allowClear
                        options={props.motherAgencies.map((item, index) => ({ label: item.name, value: index }))}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Board' name='board_id'>
                    <CustomSelect
                        open={isAddBoardInputOpen}
                        onDropdownVisibleChange={setIsAddBoardInputOpen}
                        options={boards.map((item) => ({ label: item.name, value: item.id }))}
                        onAddItem={handleAddBoard}
                        inputPlaceholder='Enter new board name'
                        addButtonText='Add Board'
                        isAddInputLoading={isAddBoardInputLoading}
                    />
                </Form.Item>
                <Form.Item className='talent-form-row__left-label' label='Manager' name='manager_id'>
                    <Select options={managers.map(item => ({ label: item.name, value: item.id }))} />
                </Form.Item>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionPrimaryInfo;
