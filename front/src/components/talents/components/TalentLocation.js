import './TalentLocation.css';

import { ReactComponent as IconInTown } from '../../../assets/icons/in-town.svg';
import { ReactComponent as IconLocation } from '../../../assets/icons/location.svg';

function TalentLocation(props) {
    let icon = 'in-town';
    let value = 'In town';

    const icons = {
        'in-town': <IconInTown />,
        'location': <IconLocation />,
    };

    if (props.location) {
        icon = 'location';
        value = props.location;
    }

    return (
        <div className='talent-location'>
            <div className='talent-location__icon'>{icons[icon]}</div>
            <div className='talent-location__text'>{value}</div>
        </div>
    );
};
export default TalentLocation;