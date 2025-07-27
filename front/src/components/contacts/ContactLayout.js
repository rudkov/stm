import './ContactLayout.css';

import { Outlet } from 'react-router';

import ContactView from './ContactView';

function ContactLayout() {
    return (
        <div className='contact-layout'>
            <ContactView inLayout={true} />
            <Outlet />
        </div>
    );
}

export default ContactLayout;
