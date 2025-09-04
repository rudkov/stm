import { useSettings } from 'context/SettingsContext';
import DynamicListSection from '../../primitives/DynamicListSection';
import { MessengersIcons } from 'components/ui-components/Icons';

function SharedSectionMessengers(props) {
    const { settings } = useSettings();

    return (
        <DynamicListSection
            {...props}
            title='Messengers'
            fieldName='messengers'
            inputPlaceholder='Messenger'
            inputPath={['info']}
            selectPath={['type', 'id']}
            selectAllowClear={false}
            addButtonLabel='Add Messenger'
            options={settings.messenger_types.map(item => ({
                label: item.name,
                value: item.id,
                icon: MessengersIcons[item.system_name],
            }))}
        />
    );
}

export default SharedSectionMessengers;
