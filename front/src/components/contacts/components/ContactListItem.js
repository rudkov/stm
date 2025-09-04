import './ContactListItem.css';
import 'helpers/shared.css';

const ContactListItem = ({ contact }) => {
    return (
        <div className='contacts-list-item'>
            <div className='ellipsis'>{contact.name}</div>
            {
                contact.companies?.map((company, index) => {
                    const jobTitleToShow = company.job_title || contact.job_title;
                    return (
                        <div className='contacts-list-item__description ellipsis' key={index}>
                            {jobTitleToShow ? `${jobTitleToShow} at ${company.name}` : company.name}
                        </div>
                    );
                })
            }
            {
                (!contact.companies || contact.companies.length === 0) && contact.job_title && (
                    <div className='contacts-list-item__description ellipsis'>
                        {contact.job_title}
                    </div>
                )
            }
        </div>
    );
};

export default ContactListItem;
