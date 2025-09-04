const PhonesList = ({ phones }) => {
    return phones?.map((phone) => {
        return (
            <div className='nested-section__cell-horizontal' key={`phone.` + phone.id}>
                <div className='text-light'>{phone.type?.name}</div>
                <div className='ellipsis'>{<a href={`tel:${phone.info}`}>{phone.info}</a>}</div>
            </div>
        );
    });
};

export default PhonesList;
