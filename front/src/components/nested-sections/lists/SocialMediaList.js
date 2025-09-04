import { SocialMediaIcons } from 'components/ui-components/Icons';

const SocialMediaList = ({ social_medias }) => {
    return social_medias?.map((socialMedia) => {
        return (
            <div className='nested-section__cell-horizontal' key={`socialMedia.` + socialMedia.id}>
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
    });
};

export default SocialMediaList;
