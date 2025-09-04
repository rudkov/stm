import NestedSection from '../../NestedSection';

import SocialMediaList from '../../lists/SocialMediaList';
import WeblinksList from '../../lists/WeblinksList';

function SharedSectionSocialMedia(props) {
    const data = props.data;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Social Media & Websites</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <SocialMediaList social_medias={data.social_medias} />
                    <WeblinksList weblinks={data.weblinks} />
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default SharedSectionSocialMedia;
