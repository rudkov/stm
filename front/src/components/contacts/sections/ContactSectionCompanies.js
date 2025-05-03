import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Input, Select, Space } from 'antd';

import { getContact } from '../../../store/contacts/contact';
import { getCompanies, fetchCompanies } from '../../../store/contacts/companies';
import DataCell from '../../ui-components/DataCell';

import { ReactComponent as IconCrossInCircle } from '../../../assets/icons/cross-in-circle.svg';

import Button from '../../buttons/Button';

function ContactSectionCompanies(props) {
    const dispatch = useDispatch();
    const contact = useSelector(getContact);
    const companies = useSelector(getCompanies);

    useEffect(() => {
        dispatch(fetchCompanies());
    }, [dispatch]);

    const { TextArea } = Input;

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Companies</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>
                    {
                        contact.companies?.map((item, index) => {
                            return <div key={"contact_company_" + item.id}>{item.name}<span className='text-light'> – {item.job_title}</span></div>;
                        })
                    }
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_1col text-regular'>

                    <Form.List
                        name="companies"
                        initialValue={[
                            { id: null, job_title: '' }
                        ]}
                    >
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, ...restField }) => (

                                    <DataCell
                                        key={`contact_company_.${key}`}
                                        value={
                                            <Space.Compact style={{ width: '100%' }}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "id"]}
                                                    style={{ width: '50%' }}
                                                >
                                                    <Select
                                                        placeholder="Company"
                                                        options={companies.map(item => ({ label: item.name, value: item.id }))}
                                                    />
                                                </Form.Item>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "job_title"]}
                                                    style={{ width: '40%' }}
                                                >
                                                    <TextArea autoSize={{ minRows: 1 }} placeholder="Job title" />
                                                </Form.Item>
                                                <Button key='contact.companies.remove' icon={IconCrossInCircle} isSmall={true} onClick={() => remove(name)} />
                                            </Space.Compact>
                                        }
                                    />


                                ))}
                                <Form.Item>
                                    <Button key='contact.companies.add' title='Add company' onClick={() => add()} />
                                </Form.Item>
                            </>
                        )}
                    </Form.List>

                </div>
            </div>
        </div>
    );
}

export default ContactSectionCompanies;