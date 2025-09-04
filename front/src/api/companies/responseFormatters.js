import dayjs from 'dayjs';

//TODO: Below is a temporary solution. We need to place date format into user settings.
//TODO: this format also appears in all date time antd controls. To double check

const dateTimeFormat = 'DD.MM.YYYY, HH:mm';

export const formatCompanyResponse = (values) => {
    let item = values;

    item.name = values.name || '';

    item.created_at = values.created_at ? dayjs(values.created_at).format(dateTimeFormat) : null;
    item.updated_at = values.updated_at ? dayjs(values.updated_at).format(dateTimeFormat) : null;

    return item;
};
