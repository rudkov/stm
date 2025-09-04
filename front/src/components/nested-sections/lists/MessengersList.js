import { MessengersIcons } from 'components/ui-components/Icons';

const MessengersList = ({ messengers }) => {
    return messengers?.map((messenger) => {
        return (
            <div className='nested-section__cell-horizontal' key={`messenger.` + messenger.id}>
                <div className='text-light'>{messenger.type?.name}</div>
                <div className='nested-section__item_with_icon ellipsis'>
                    <div className='nested-section__icon'>{MessengersIcons[messenger.type?.system_name]}</div>
                    {messenger.type?.url ? (
                        <a href={`${messenger.type.url}${messenger.info}`} className='ellipsis' target='_blank' rel='noreferrer'>
                            {messenger.info}
                        </a>
                    ) : (
                        <span className='ellipsis'>{messenger.info}</span>
                    )}
                </div>
            </div>
        );
    });
};

export default MessengersList;
