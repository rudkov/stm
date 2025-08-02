import './TalentUsername.css';
import '../../../helpers/shared.css';

import { Avatar } from 'antd';

function TalentUsername({ name, className = '' }) {
    return (
        <div className={`talent-username ${className}`}>
            <Avatar className='talent-username__avatar'>{name?.charAt(0)}</Avatar>
            <span className='talent-username__name text-regular'>{name}</span>
        </div>
    );
}
export default TalentUsername;
