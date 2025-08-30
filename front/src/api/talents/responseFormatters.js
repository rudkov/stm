import dayjs from 'dayjs';
import measurementsConverter from 'helpers/measurements-converter';

//TODO: Below is a temporary solution. We need to place date format into user settings.
//TODO: this format also appears in all date time antd controls. To double check

const inputDateFormat = 'YYYY-MM-DD';
const outputDateFormat = 'DD.MM.YYYY';
const dateTimeFormat = 'DD.MM.YYYY, HH:mm';

export const formatTalentResponse = (values) => {
    let item = values;

    item.full_name = (values.first_name || '').concat(' ', values.last_name || '').trim();
    item.legal_full_name = (values.legal_first_name || '').concat(' ', values.legal_last_name || '').trim();

    const birthDate = values.birth_date ? dayjs(values.birth_date, inputDateFormat) : null;
    item.birth_date = birthDate ? birthDate.format(outputDateFormat) : null;
    item.age = birthDate ? dayjs().diff(birthDate, 'years') : null;

    item.is_lifestyle = (values.is_lifestyle === 1) ? 'Lifestyle' : (values.is_lifestyle === 0) ? 'Fashion' : null;
    item.gender_id = values.gender_id || '';

    item.hair_color_id = values.hair_color_id || '';
    item.hair_length_id = values.hair_length_id || '';
    item.eye_color_id = values.eye_color_id || '';
    item.cup_size_id = values.cup_size_id || '';
    item.shoe_size_id = values.shoe_size_id || '';
    item.shirt_size_id = values.shirt_size_id || '';
    item.suit_cut_id = values.suit_cut_id || '';
    item.dress_size_id = values.dress_size_id || '';
    item.skin_color_id = values.skin_color_id || '';
    item.is_ears_pierced = values.is_ears_pierced ?? null;
    item.height_cm = values.height_cm || '';
    item.height_in = measurementsConverter(values.height_cm, 'ft in');
    item.bust_cm = values.bust_cm || '';
    item.bust_in = measurementsConverter(values.bust_cm, 'in', true);
    item.waist_cm = values.waist_cm || '';
    item.waist_in = measurementsConverter(values.waist_cm, 'in', true);
    item.hips_cm = values.hips_cm || '';
    item.hips_in = measurementsConverter(values.hips_cm, 'in', true);
    item.weight_kg = values.weight_kg || '';
    item.weight_lb = measurementsConverter(values.weight_kg, 'lb', true);
    item.scars = values.scars || '';
    item.tattoos = values.tattoos || '';
    item.piercings = values.piercings || '';

    item.is_vegetarian = values.is_vegetarian ?? null;

    item.is_accent = values.is_accent ?? null;

    item.is_lingerie = values.is_lingerie ?? null;
    item.is_nude = values.is_nude ?? null;
    item.is_fur = values.is_fur ?? null;
    item.is_liquor_ads = values.is_liquor_ads ?? null;
    item.is_smoking_ads = values.is_smoking_ads ?? null;
    item.is_gambling_ads = values.is_gambling_ads ?? null;
    item.is_faithbased_ads = values.is_faithbased_ads ?? null;
    item.is_political_ads = values.is_political_ads ?? null;
    item.is_topless = values.is_topless ?? null;
    item.is_swimwear = values.is_swimwear ?? null;
    item.is_sports = values.is_sports ?? null;

    item.achievements = values.achievements || '';
    item.performance_skills = values.performance_skills || '';
    item.biography = values.biography || '';

    item.addresses = values.addresses.sort(
        (a, b) => {
            if (a.type && b.type) {
                return a.type.sort_order - b.type.sort_order
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.phones = values.phones.sort(
        (a, b) => {
            if (a.type && b.type) {
                return a.type.sort_order - b.type.sort_order
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.emails = values.emails.sort(
        (a, b) => {
            if (a.type && b.type) {
                return a.type.sort_order - b.type.sort_order
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.social_medias = values.social_medias.sort(
        (a, b) => {
            if (a.type && b.type) {
                if (a.type.name > b.type.name) {
                    return 1;
                } else if (b.type.name > a.type.name) {
                    return -1;
                } else {
                    return 0;
                }
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.messengers = values.messengers.sort(
        (a, b) => {
            if (a.type && b.type) {
                if (a.type.name > b.type.name) {
                    return 1;
                } else if (b.type.name > a.type.name) {
                    return -1;
                } else {
                    return 0;
                }
            }
            else
                return -999999; //this hack is for sorting values without type (null values) at the bottom of the list
        });

    item.created_at = values.created_at ? dayjs(values.created_at).format(dateTimeFormat) : null;
    item.updated_at = values.updated_at ? dayjs(values.updated_at).format(dateTimeFormat) : null;

    return item;
};

export const formatTalentLocationsResponse = (locations) => {
    return locations.map(location => ({
        id: location.name,
        name: location.name || 'In Town'
    }));
};
