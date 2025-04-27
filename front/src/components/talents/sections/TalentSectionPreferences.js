import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Select } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import DataCell from '../../ui-components/DataCell';

import { ReactComponent as IconYes } from '../../../assets/icons/yes.svg';
import { ReactComponent as IconNo } from '../../../assets/icons/no.svg';

function TalentSectionPreferences(props) {
    const talent = useSelector(getTalent);

    const { Option } = Select;

    const icons = {
        'Yes': <IconYes />,
        'No': <IconNo />,
    };

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Preferences</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_4col text-regular'>
                    <DataCell
                        icon={icons[talent.is_lingerie]}
                        noLabel={true}
                        value='Lingerie'
                    />
                    <DataCell
                        icon={icons[talent.is_nude]}
                        noLabel={true}
                        value='Nude'
                    />
                    <DataCell
                        icon={icons[talent.is_fur]}
                        noLabel={true}
                        value='Fur'
                    />
                    <DataCell
                        icon={icons[talent.is_liquor_ads]}
                        noLabel={true}
                        value='Liquor ads'
                    />
                    <DataCell
                        icon={icons[talent.is_smoking_ads]}
                        noLabel={true}
                        value='Smoking ads'
                    />
                    <DataCell
                        icon={icons[talent.is_gambling_ads]}
                        noLabel={true}
                        value='Gambling ads'
                    />
                    <DataCell
                        icon={icons[talent.is_faithbased_ads]}
                        noLabel={true}
                        value='Faithbased ads'
                    />
                    <DataCell
                        icon={icons[talent.is_political_ads]}
                        noLabel={true}
                        value='Political ads'
                    />
                    <DataCell
                        icon={icons[talent.is_topless]}
                        noLabel={true}
                        value='Topless'
                    />
                    <DataCell
                        icon={icons[talent.is_swimwear]}
                        noLabel={true}
                        value='Swimwear'
                    />
                    <DataCell
                        icon={icons[talent.is_sports]}
                        noLabel={true}
                        value='Sports'
                    />
                </div>
            </div>
            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_4col text-regular'>
                    <DataCell
                        label='Lingerie'
                        value={
                            <Form.Item name='is_lingerie'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Nude'
                        value={
                            <Form.Item name='is_nude'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Fur'
                        value={
                            <Form.Item name='is_fur'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Liquor ads'
                        value={
                            <Form.Item name='is_liquor_ads'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Smoking ads'
                        value={
                            <Form.Item name='is_smoking_ads'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Gambling ads'
                        value={
                            <Form.Item name='is_gambling_ads'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Faithbased ads'
                        value={
                            <Form.Item name='is_faithbased_ads'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Political ads'
                        value={
                            <Form.Item name='is_political_ads'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Topless'
                        value={
                            <Form.Item name='is_topless'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Swimwear'
                        value={
                            <Form.Item name='is_swimwear'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Sports'
                        value={
                            <Form.Item name='is_sports'>
                                <Select allowClear>
                                    <Option value="Yes"><div className='select--badge select--badge-select'>{icons['Yes']}</div>Yes</Option>
                                    <Option value="No"><div className='select--badge select--badge-select'>{icons['No']}</div>No</Option>
                                </Select>
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default TalentSectionPreferences;