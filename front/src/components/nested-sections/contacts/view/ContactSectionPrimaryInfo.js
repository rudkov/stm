import 'helpers/shared.css';

import AddressesList from '../../lists/AddressesList';
import CategoriesList from '../../lists/CategoriesList';
import EmailsList from '../../lists/EmailsList';
import MessengersList from '../../lists/MessengersList';
import PhonesList from '../../lists/PhonesList';
import SocialMediaList from '../../lists/SocialMediaList';
import WeblinksList from '../../lists/WeblinksList';

import NestedSection from '../../NestedSection';

function ContactSectionPrimaryInfo({ data, className }) {

    return (
        <NestedSection className={className}>
            <NestedSection.Body>
                <div className='nested-section__grid'>
                    <div className='nested-section__cell-horizontal'>
                        <div className='text-light'>Categories</div>
                        <div className='nested-section__column'>
                            <CategoriesList categories={data.categories} />
                        </div>
                    </div>
                    <WeblinksList weblinks={data.weblinks} />
                    <SocialMediaList social_medias={data.social_medias} />
                    {(data.emails?.length > 0 || data?.phones?.length > 0 || data?.messengers?.length > 0) && (
                        <>
                            <div className='divider' />
                            <PhonesList phones={data.phones} />
                            <EmailsList emails={data.emails} />
                            <MessengersList messengers={data.messengers} />
                        </>
                    )}
                    {data.addresses?.length > 0 && (
                        <>
                            <div className='divider' />
                            <AddressesList addresses={data.addresses} />
                        </>
                    )}
                </div>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default ContactSectionPrimaryInfo;
