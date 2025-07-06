import NestedSection from '../../../ui-components/NestedSection';

import Weblink from '../../../ui-components/Weblink';

import { SocialMediaIcons } from '../../../ui-components/Icons';

function TalentSectionSocialMedia(props) {
    const talent = props.talent;

    return (
        <NestedSection className={props.className}>
            <NestedSection.Header>Social Media & Websites</NestedSection.Header>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    {
                        talent.social_medias?.map((socialMedia) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.socialMedia.` + socialMedia.id}>
                                    <div className='text-light'>{socialMedia.type?.name}</div>
                                    <div className='nested-section__item_with_icon ellipsis'>
                                        <div className='nested-section__icon'>{SocialMediaIcons[socialMedia.type?.system_name]}</div>
                                        {socialMedia.type?.url ? (
                                            <a href={`${socialMedia.type.url}${socialMedia.info}`} className='ellipsis' target='_blank' rel='noreferrer'>
                                                {socialMedia.info}
                                            </a>
                                        ) : (
                                            <span className='ellipsis'>{socialMedia.info}</span>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    }
                    {
                        talent.weblinks?.map((weblink) => {
                            return (
                                <div className='nested-section__cell-horizontal' key={`talent.weblink.` + weblink.id}>
                                    <div className='text-light'>Website</div>
                                    <div className='ellipsis'><Weblink url={weblink.info} /></div>
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
