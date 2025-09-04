import { useSettings } from 'context/SettingsContext';
import DynamicListSection from '../../primitives/DynamicListSection';
import { SocialMediaIcons } from 'components/ui-components/Icons';

function SharedSectionSocialMedia(props) {
    const { settings } = useSettings();

    return (
        <DynamicListSection
            {...props}
            title='Social Media'
            fieldName='social_medias'
            inputPlaceholder='Username'
            inputPath={['info']}
            selectPath={['type', 'id']}
            selectAllowClear={false}
            addButtonLabel='Add Social Media'
            options={settings.social_media_types.map(item => ({
                label: item.name,
                value: item.id,
                icon: SocialMediaIcons[item.system_name],
            }))}
        />
    );
}

export default SharedSectionSocialMedia;
