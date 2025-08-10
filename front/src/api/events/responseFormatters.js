import dayjs from 'dayjs';

//TODO: Below is a temporary solution. We need to place date format into user settings.
//TODO: this format also appears in all date time antd controls. To double check
const dateTimeFormat = 'DD.MM.YYYY, HH:mm';

export const formatEventResponse = (values) => {
    let item = values;

    item.talents?.map((item, index) => {
        return item.full_name = item.first_name.concat(' ', item.last_name);
    })

    item.contacts?.map((item, index) => {
        return item.full_name = item.first_name.concat(' ', item.last_name);
    })

    item.event_chunks?.map((item, index) => {
        item.start_date_readable = item.start_date ? dayjs(item.start_date).format(dateTimeFormat) : null;
        item.end_date_readable = item.end_date ? dayjs(item.end_date).format(dateTimeFormat) : null;
        return item;
    })

    item.created_at = values.created_at ? dayjs(values.created_at).format(dateTimeFormat) : null;
    item.updated_at = values.updated_at ? dayjs(values.updated_at).format(dateTimeFormat) : null;

    return item;
};
