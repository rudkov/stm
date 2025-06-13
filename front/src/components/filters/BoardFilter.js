import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Select } from 'antd';

import { fetchTalentBoards, getTalentBoards } from '../../store/talents/talentBoards';

function BoardFilter(props) {
    const dispatch = useDispatch();
    const fetchedBoards = useSelector(getTalentBoards);
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        dispatch(fetchTalentBoards());
    }, [dispatch]);

    useEffect(() => {
        if (fetchedBoards) {
            setBoards([{ id: 0, name: 'All Models' }, ...fetchedBoards]);
        }
    }, [fetchedBoards]);

    const onChange = (value) => {
        props.setValue(value);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(value));
    };

    let result = null;

    if (boards && Object.keys(boards).length > 0) {
        result = (
            <Select
                options={boards.map(item => ({ label: item.name, value: item.id }))}
                value={props.value}
                onChange={onChange}
            />
        );
    }

    return result;
}

export default BoardFilter;
