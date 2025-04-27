import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input } from 'antd';

import { getContact } from '../../../store/contacts/contact';
import DataCell from '../../ui-components/DataCell';

function ContactSectionNotes(props) {
    const contact = useSelector(getContact);

    const { TextArea } = Input;

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Notes</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        className='invisible-bottom-border'
                        value={contact.comment}
                    />
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        value={
                            <Form.Item name='comment' className='form-item--border-bottom'>
                                <TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default ContactSectionNotes;