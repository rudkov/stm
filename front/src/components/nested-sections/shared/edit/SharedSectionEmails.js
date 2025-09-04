import { useTeamSettings } from 'context/TeamSettingsContext';
import DynamicListSection from '../../primitives/DynamicListSection';

function SharedSectionEmails(props) {
    const { teamSettings } = useTeamSettings();

    return (
        <DynamicListSection
            {...props}
            title='Emails'
            fieldName='emails'
            inputPlaceholder='Email'
            inputPath={['info']}
            selectPath={['type', 'id']}
            addButtonLabel='Add Email'
            options={teamSettings.communication_types.email.map(item => ({
                label: item.name,
                value: item.id,
            }))}
        />
    );
}

export default SharedSectionEmails;
