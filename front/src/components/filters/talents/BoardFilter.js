import { useMemo } from 'react';
import { Select } from 'antd';

import { useGetTalentBoardsQuery } from 'api/talents/talentBoardsApi';

function BoardFilter(props) {
    const { data: fetchedBoards } = useGetTalentBoardsQuery();

    const boards = useMemo(() => {
        if (fetchedBoards) {
            return [{ id: 0, name: 'All Models' }, ...fetchedBoards];
        }
        return [];
    }, [fetchedBoards]);

    const onChange = (value) => {
        props.setValue(value);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(value));
    };

    let result = null;

    if (boards.length > 0) {
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
