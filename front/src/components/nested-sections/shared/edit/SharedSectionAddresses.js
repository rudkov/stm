import { useTeamSettings } from 'context/TeamSettingsContext';
import DynamicListSection from '../../primitives/DynamicListSection';

function SharedSectionAddresses(props) {
    const { teamSettings } = useTeamSettings();

    return (
        <DynamicListSection
            {...props}
            title='Addresses'
            fieldName='addresses'
            inputPlaceholder='Address'
            inputPath={['info']}
            selectPath={['type', 'id']}
            addButtonLabel='Add Address'
            options={teamSettings.communication_types.address.map(i => ({ label: i.name, value: i.id }))}
            inputComponent='textarea'
            inputProps={{ autoSize: { minRows: 2 } }}
            layout='vertical'
        />
    );
}

export default SharedSectionAddresses;
