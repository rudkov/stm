import '../../../helpers/form.css';
import '../../../helpers/info-panel.css';
import '../../../helpers/shared.css';

import { useSelector } from 'react-redux';

import { Form, Input, Select } from 'antd';

import { getTalent } from '../../../store/talents/talent';
import { useSettings } from '../../../context/SettingsContext';

import DataCell from '../../ui-components/DataCell';

import IconColorBadge from '../../ui-components/IconColorBadge';

function TalentSectionBody(props) {
    const talent = useSelector(getTalent);
    const { settings } = useSettings();

    const { Option } = Select;
    const { TextArea } = Input;

    return (
        <div className='info-panel--section'>
            <div className='info-panel--section--header'>
                <div className='info-panel--section--title text-regular'>Body</div>
            </div>
            <div className={`${!props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_4col text-regular'>
                    <DataCell
                        className='invisible-bottom-border'
                        icon={<IconColorBadge color={'color--hair--' + talent.hair_color?.system_name} />}
                        label='Hair color'
                        value={talent.hair_color?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Height'
                        value={talent.height_cm ? talent.height_cm + ' cm' : null}
                        info={talent.height_in ? talent.height_in : null}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Waist'
                        value={talent.waist_cm ? talent.waist_cm + ' cm' : null}
                        info={talent.waist_in ? talent.waist_in + ' in' : null}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Shoe'
                        value={talent.shoe_size?.size_adult_uk ? talent.shoe_size?.size_adult_uk + ' UK' : null}
                        info={talent.shoe_size?.size_adult_us_men ? talent.shoe_size?.size_adult_us_men + ' US' : null}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Hair length'
                        value={talent.hair_length?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Bust'
                        value={talent.bust_cm ? talent.bust_cm + ' cm' : null}
                        info={talent.bust_in ? talent.bust_in + ' in' : null}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Hips'
                        value={talent.hips_cm ? talent.hips_cm + ' cm' : null}
                        info={talent.hips_in ? talent.hips_in + ' in' : null}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Shirt'
                        value={talent.shirt_size?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        icon={<IconColorBadge color={'color--eyes--' + talent.eye_color?.system_name} />}
                        label='Eyes'
                        value={talent.eye_color?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Cups'
                        value={talent.cup_size?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Weight'
                        value={talent.weight_kg ? talent.weight_kg + ' kg' : null}
                        info={talent.weight_lb ? talent.weight_lb + ' lb' : null}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Suit cut'
                        value={talent.suit_cut?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        icon={<IconColorBadge color={'color--skin--' + talent.skin_color?.system_name} />}
                        label='Skin color'
                        value={talent.skin_color?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Ears pierced'
                        value={talent.is_ears_pierced}
                    />
                    <div></div>
                    <DataCell
                        className='invisible-bottom-border'
                        label='Dress'
                        value={talent.dress_size?.name}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Scars'
                        value={talent.scars}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Tattoos'
                        value={talent.tattoos}
                    />
                    <DataCell
                        className='invisible-bottom-border'
                        label='Piercings'
                        value={talent.piercings}
                    />
                </div>
            </div>

            <div className={`${props.editMode ? "" : "hidden"}`}>
                <div className='info-panel--section_4col text-regular'>
                    <DataCell
                        label='Hair color'
                        value={
                            <Form.Item name='hair_color_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_hair_colors.map((item) => {
                                            return <Option value={item.id} key={`talent_hair_color_.${item.id}`}><div className='select-text-with-icon'><IconColorBadge color={'color--badge-select color--hair--' + item.system_name} /><div className='select-text-value'>{item.name}</div></div></Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Height'
                        value={
                            <Form.Item name='height_cm' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Waist'
                        value={
                            <Form.Item name='waist_cm' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Shoe'
                        value={
                            <Form.Item name='shoe_size_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_shoe_sizes.map((item) => {
                                            return <Option value={item.id} key={`talent_shoe_size_.${item.id}`}>{item.size_adult_us_men}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Hair length'
                        value={
                            <Form.Item name='hair_length_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_hair_lengths.map((item) => {
                                            return <Option value={item.id} key={`talent_hair_length_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Bust'
                        value={
                            <Form.Item name='bust_cm' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Hips'
                        value={
                            <Form.Item name='hips_cm' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Shirt'
                        value={
                            <Form.Item name='shirt_size_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_shirt_sizes.map((item) => {
                                            return <Option value={item.id} key={`talent_shirt_size_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Eyes'
                        value={
                            <Form.Item name='eye_color_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_eye_colors.map((item) => {
                                            return <Option value={item.id} key={`talent_eye_color_.${item.id}`}><IconColorBadge color={'color--badge-select color--eyes--' + item.system_name} />{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Cups'
                        value={
                            <Form.Item name='cup_size_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_cup_sizes.map((item) => {
                                            return <Option value={item.id} key={`talent_cup_size_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Weight'
                        value={
                            <Form.Item name='weight_kg' className='form-item--border-bottom'>
                                <Input />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Suit cut'
                        value={
                            <Form.Item name='suit_cut_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_suit_cuts.map((item) => {
                                            return <Option value={item.id} key={`talent_suit_cut_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Skin color'
                        value={
                            <Form.Item name='skin_color_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_skin_colors.map((item) => {
                                            return <Option value={item.id} key={`talent_skin_color_.${item.id}`}><IconColorBadge color={'color--badge-select color--skin--' + item.system_name} />{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Ears pierced'
                        value={
                            <Form.Item name='is_ears_pierced' className='form-item--border-bottom'>

                                <Select allowClear>
                                    <Option value="Yes">Yes</Option>
                                    <Option value="No">No</Option>
                                </Select>

                            </Form.Item>
                        }
                    />
                    <div></div>
                    <DataCell
                        label='Dress size'
                        value={
                            <Form.Item name='dress_size_id' className='form-item--border-bottom'>
                                <Select allowClear>
                                    {
                                        settings.talent_dress_sizes.map((item) => {
                                            return <Option value={item.id} key={`talent_dress_size_.${item.id}`}>{item.name}</Option>;
                                        })
                                    }
                                </Select>
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Scars'
                        value={
                            <Form.Item name='scars' className='form-item--border-bottom'>
                                <TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Tattoos'
                        value={
                            <Form.Item name='tattoos' className='form-item--border-bottom'>
                                <TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                    <DataCell
                        label='Piercings'
                        value={
                            <Form.Item name='piercings' className='form-item--border-bottom'>
                                <TextArea autoSize={{ minRows: 1 }} />
                            </Form.Item>
                        }
                    />
                </div>
            </div>
        </div>
    );
}

export default TalentSectionBody;