import './TalentUsername.css';
import '../../../helpers/shared.css';

import { Avatar } from 'antd';

function TalentUsername(props) {
    return (
        <div className='talent-username'>
            <Avatar className='talent-username__avatar'>{props.name?.charAt(0)}</Avatar>
            <span className='talent-username__name text-regular'>{props.name}</span>
        </div>
    );
};
export default TalentUsername;