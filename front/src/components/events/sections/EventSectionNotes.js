import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input } from 'antd';

import { getEvent } from '../../../store/events/event';
import DataCell from '../../ui-components/DataCell';

function EventSectionNotes(props) {
    const event = useSelector(getEvent);

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Notes</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        className='invisible-bottom-border'
                        value={event.notes}
                    />
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    <DataCell
                        value={
                            <Form.Item name='notes' className='form-item--border-bottom'>
                                <Input.TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default EventSectionNotes;