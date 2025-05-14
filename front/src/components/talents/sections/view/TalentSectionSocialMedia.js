import NestedSection from '../../../ui-components/NestedSection';

import { SocialMediaIcons } from '../../../ui-components/Icons';

function TalentSectionSocialMedia(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Social Media</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.social_medias?.map((socialMedia) => {
                            return (
                                <div className='nested-section__cell' key={`talent.socialMedia.` + socialMedia.id}>
                                    <div className='text-light'>{socialMedia.type?.name}</div>
                                    <div className='nested-section__item_with_icon ellipsis'>
                                        <div className='nested-section__icon'>{SocialMediaIcons[socialMedia.type?.system_name]}</div>
                                        {<a href={`${socialMedia.type?.url + socialMedia.info}`} className='ellipsis' target='_blank' rel='noreferrer'>{socialMedia.info}</a>}
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default TalentSectionSocialMedia;
