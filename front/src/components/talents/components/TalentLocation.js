import './TalentLocation.css';
import '../../../helpers/shared.css';

import DataCell from '../../ui-components/DataCell';
import { ReactComponent as IconInTown } from '../../../assets/icons/in-town-18x18.svg';
import { ReactComponent as IconLocation } from '../../../assets/icons/location.svg';

function TalentLocation(props) {

    const icons = {
        'in-town': <IconInTown />,
        'location': <IconLocation />,
    };

    let icon = '';
    let value = '';

    if (!props.location) {
        icon = 'in-town';
        value = 'In town';
    }
    else {
        icon = 'location';
        value = props.location;
    }

    return (
        <DataCell
            icon={icons[icon]}
            value={value}
        />
    );
};
export default TalentLocation;