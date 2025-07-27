import './ContactSectionMain.css';

import { Button } from 'antd';

function ContactSectionMain(props) {
    const contact = props.data;

    return (
        <div className='contact-section-main'>
            <div className='contact-section-main__header'>
                <div className='contact-section-main__contact_name'>{contact.first_name} {contact.last_name}</div>
                <div className='contact-section-main__contact_categories'>Category 1, Category 2, Category 3</div>
            </div>
            {props.editAction && (
                <div className='contact-section-main__controls'>
                    <Button onClick={props.editAction}>Edit</Button>
                </div>
            )}
        </div>
    );
}

export default ContactSectionMain;
