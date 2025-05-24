import IconFacebook from '../../assets/icons/vendor/facebook.svg';
import IconInstagram from '../../assets/icons/vendor/instagram.svg';
import IconTiktok from '../../assets/icons/vendor/tiktok.svg';
import IconTwitter from '../../assets/icons/vendor/twitter.svg';
import IconWechat from '../../assets/icons/vendor/wechat.svg';
import IconYoutube from '../../assets/icons/vendor/youtube.svg';

import IconFacebookMessenger from '../../assets/icons/vendor/facebook-messenger.svg';
import IconTelegram from '../../assets/icons/vendor/telegram.svg';
import IconWhatsapp from '../../assets/icons/vendor/whatsapp.svg';

import IconNo from '../../assets/icons/no.svg';
import IconYes from '../../assets/icons/yes.svg';

export const MessengersIcons = {
    'facebook-messenger': <img src={IconFacebookMessenger} alt="Facebook Messenger icon" />,
    'telegram': <img src={IconTelegram} alt="Telegram icon" />,
    'wechat': <img src={IconWechat} alt="WeChat icon" />,
    'whatsapp': <img src={IconWhatsapp} alt="WhatsApp icon" />,
};

export const SocialMediaIcons = {
    'facebook': <img src={IconFacebook} alt="Facebook icon" />,
    'instagram': <img src={IconInstagram} alt="Instagram icon" />,
    'tiktok': <img src={IconTiktok} alt="TikTok icon" />,
    'twitter': <img src={IconTwitter} alt="X icon" />,
    'youtube': <img src={IconYoutube} alt="YouTube icon" />,
};

export const YesNoIcons = {
    0: <img src={IconNo} alt='No icon' />,
    1: <img src={IconYes} alt='Yes icon' />,
};
