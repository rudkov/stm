import { useTeamSettings } from 'context/TeamSettingsContext';
import DynamicListSection from '../../primitives/DynamicListSection';

function SharedSectionPhones(props) {
    const { teamSettings } = useTeamSettings();

    return (
        <DynamicListSection
            {...props}
            title='Phones'
            fieldName='phones'
            inputPlaceholder='Phone number'
            inputPath={['info']}
            selectPath={['type', 'id']}
            addButtonLabel='Add Phone'
            options={teamSettings.communication_types.phone.map(item => ({
                label: item.name,
                value: item.id,
            }))}
        />
    );
}

export default SharedSectionPhones;
