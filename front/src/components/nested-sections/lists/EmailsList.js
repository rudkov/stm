const EmailsList = ({ emails }) => {
    return emails?.map((email) => {
        return (
            <div className='nested-section__cell-horizontal' key={`email.` + email.id}>
                <div className='text-light'>{email.type?.name}</div>
                <div className='ellipsis'>{<a href={`mailto:${email.info}`}>{email.info}</a>}</div>
            </div>
        );
    });
};

export default EmailsList;
