import './Filter.css';
import './BodyFilter.css';
import '../../helpers/shared.css';

import { useEffect, useState, useCallback } from 'react';
import { Form, Select, Slider } from 'antd';

import { useSettings } from '../../context/SettingsContext';

import Filter from './Filter';

import IconColorBadge from '../ui-components/IconColorBadge';

const formConfig = {
    bust: [55, 160],
    height: [70, 210],
    hips: [55, 170],
    waist: [45, 150],
    weight: [15, 180],
};

function BodyFilter(props) {
    const [form] = Form.useForm();
    const { settings } = useSettings();
    const [isApplied, setIsApplied] = useState(false);

    const initForm = useCallback((values) => {
        const formValues = {
            bust: Array.isArray(values.bust) && values.bust.length === 0 ? [...formConfig.bust] : (values.bust ?? [...formConfig.bust]),
            height: Array.isArray(values.height) && values.height.length === 0 ? [...formConfig.height] : (values.height ?? [...formConfig.height]),
            hips: Array.isArray(values.hips) && values.hips.length === 0 ? [...formConfig.hips] : (values.hips ?? [...formConfig.hips]),
            waist: Array.isArray(values.waist) && values.waist.length === 0 ? [...formConfig.waist] : (values.waist ?? [...formConfig.waist]),
            weight: Array.isArray(values.weight) && values.weight.length === 0 ? [...formConfig.weight] : (values.weight ?? [...formConfig.weight]),

            cupSize: values.cupSize ?? [],
            dressSize: values.dressSize ?? [],
            eyeColor: values.eyeColor ?? [],
            hairColor: values.hairColor ?? [],
            hairLength: values.hairLength ?? [],
            skinColor: values.skinColor ?? [],
            shirtSize: values.shirtSize ?? [],
            shoeSize: values.shoeSize ?? [],
            suitCut: values.suitCut ?? [],
        };

        form.setFieldsValue(formValues);
    }, [form]);

    const checkIfFiltersApplied = useCallback((values) => {
        const processedValues = { ...values };
        const rangeFields = ['bust', 'height', 'hips', 'waist', 'weight'];

        rangeFields.forEach((field) => {
            const val = processedValues[field];
            const def = formConfig[field];
            if (Array.isArray(val) && val.length === 2 && val[0] === def[0] && val[1] === def[1]) {
                processedValues[field] = [];
            }
        });

        return !Object.values(processedValues).every(val => Array.isArray(val) && val.length === 0);
    }, []);

    useEffect(() => {
        initForm(props?.selectedValues);
        setIsApplied(checkIfFiltersApplied(props?.selectedValues));
    }, [props?.selectedValues, initForm, checkIfFiltersApplied]);

    useEffect(() => {
        if (props?.selectedValues) {
            setIsApplied(checkIfFiltersApplied(props.selectedValues));
        }
    }, [props.selectedValues, checkIfFiltersApplied]);

    const applyFilter = () => {
        const values = form.getFieldsValue();
        const processedValues = { ...values };
        const rangeFields = ['bust', 'height', 'hips', 'waist', 'weight'];

        rangeFields.forEach((field) => {
            const val = processedValues[field];
            const def = formConfig[field];
            if (Array.isArray(val) && val.length === 2 && val[0] === def[0] && val[1] === def[1]) {
                processedValues[field] = [];
            }
        });

        setIsApplied(checkIfFiltersApplied(processedValues));
        props.setValues(processedValues);
        sessionStorage.setItem(props.uniqueName, JSON.stringify(processedValues));
    };

    const clearFilter = () => {
        initForm({});
        props.setValues({});
        sessionStorage.setItem(props.uniqueName, JSON.stringify({}));
        setIsApplied(false);
    };

    return (
        <Filter
            title='Body'
            uniqueName={props.uniqueName}
            applied={isApplied}
            clearFilter={clearFilter}
        >
            <Form
                name='talent.filter.body'
                form={form}
                layout='vertical'
                className='body-filter'
            >
                <Form.Item label='Bust' name='bust'>
                    <Slider
                        range
                        min={formConfig.bust[0]}
                        max={formConfig.bust[1]}
                        style={{ width: '100%' }}
                        onChangeComplete={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Height' name='height'>
                    <Slider
                        range
                        min={formConfig.height[0]}
                        max={formConfig.height[1]}
                        style={{ width: '100%' }}
                        onChangeComplete={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Hips' name='hips'>
                    <Slider
                        range
                        min={formConfig.hips[0]}
                        max={formConfig.hips[1]}
                        style={{ width: '100%' }}
                        onChangeComplete={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Waist' name='waist'>
                    <Slider
                        range
                        min={formConfig.waist[0]}
                        max={formConfig.waist[1]}
                        style={{ width: '100%' }}
                        onChangeComplete={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Weight' name='weight'>
                    <Slider
                        range
                        min={formConfig.weight[0]}
                        max={formConfig.weight[1]}
                        style={{ width: '100%' }}
                        onChangeComplete={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Skin color' name='skinColor'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_skin_colors || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                            icon: <IconColorBadge color={'color--badge-select color--skin--' + item.system_name} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Eyes' name='eyeColor'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_eye_colors || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                            icon: <IconColorBadge color={'color--badge-select color--eyes--' + item.system_name} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Hair color' name='hairColor'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_hair_colors || []).map((item) => ({
                            value: item.id,
                            label: item.name,
                            icon: <IconColorBadge color={'color--badge-select color--hair--' + item.system_name} />
                        }))}
                        optionRender={(option) => (
                            <div className='select-option-with-icon'>
                                {option.data.icon}
                                {option.data.label}
                            </div>
                        )}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Hair length' name='hairLength'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_hair_lengths || []).map((item) => ({ value: item.id, label: item.name }))}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Cups' name='cupSize'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_cup_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Shirt' name='shirtSize'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_shirt_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Suit cut' name='suitCut'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_suit_cuts || []).map((item) => ({ value: item.id, label: item.name }))}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Dress size' name='dressSize'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_dress_sizes || []).map((item) => ({ value: item.id, label: item.name }))}
                        onChange={applyFilter}
                    />
                </Form.Item>
                <Form.Item label='Shoe' name='shoeSize'>
                    <Select
                        allowClear
                        mode='multiple'
                        size='small'
                        options={(settings.talent_shoe_sizes || []).map((item) => ({ value: item.id, label: item.size_adult_us_men }))}
                        onChange={applyFilter}
                    />
                </Form.Item>
            </Form>
        </Filter>
    );
}

export default BodyFilter;
