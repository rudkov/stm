import './ContactSectionMain.css';

import { Button } from 'antd';

function ContactSectionMain(props) {
    const contact = props.data;

    return (
        <div className='contact-section-main'>
            <div className='contact-section-main__header'>
                <div className='contact-section-main__contact-name'>{contact.first_name} {contact.last_name}</div>
                <div className='contact-section-main__contact-job_title'>{contact.job_title}</div>
            </div>
            {props.editAction && (
                <div className='contact-section-main__controls'>
                    <Button onClick={() => props.editAction(contact.id)}>Edit</Button>
                </div>
            )}
        </div>
    );
}

export default ContactSectionMain;
