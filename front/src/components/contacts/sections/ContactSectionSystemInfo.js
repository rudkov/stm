import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { getContact } from '../../../store/contacts/contact';
import DataCell from '../../ui-components/DataCell';

function ContactSectionSystemInfo() {
    const contact = useSelector(getContact);

    return (
        <div className='info-panel--section info-panel--system-info'>
            <div className='info-panel--section_2col text-regular'>
                <DataCell
                    label='Updated'
                    value={contact.updated_by?.name + ' · ' + contact.updated_at}
                />
                <DataCell
                    label='Created'
                    value={contact.created_by?.name + ' · ' + contact.created_at}
                />
            </div>
        </div>
    );
}

export default ContactSectionSystemInfo;