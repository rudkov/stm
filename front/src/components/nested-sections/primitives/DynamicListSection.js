import './DynamicListSection.css';
import 'helpers/form.css';

import { Button, Form, Input, Select } from 'antd';
import { useMemo } from 'react';

import NestedSection from '../NestedSection';

import { cx } from 'helpers/classNames';

import { ReactComponent as IconDelete } from 'assets/icons/delete-20x20.svg';

// helper to set deep value by path creating nested objects
const setDeep = (obj, path, value) => {
    if (!Array.isArray(path)) return obj;
    let cursor = obj;
    path.forEach((key, idx) => {
        if (idx === path.length - 1) {
            cursor[key] = value;
        } else {
            cursor[key] = cursor[key] || {};
            cursor = cursor[key];
        }
    });
    return obj;
};

/**
 * Generic section that renders a repeatable list of objects with the shape
 * { type: { id }, info: string } inside an Ant Design Form.
 *
 * Props expected (besides className / id / form passed by wrapper):
 *  - title               : Section title ("Emails")
 *  - fieldName           : Name used in Form.List ("emails")
 *  - inputPlaceholder    : Placeholder for <Input>
 *  - selectPlaceholder   : Placeholder for <Select>
 *  - addButtonLabel      : Caption for the "Add" button
 *  - options             : Array<{ label, value, ... }> for <Select>
 *  - optionRender?       : Custom renderer for select options
 *  - layout              : Layout mode, either "horizontal" or "vertical" (default: "horizontal")
 *  - inputPath?          : Array path (e.g., ["info"]) that points to the text input value inside the item
 *  - selectPath?         : Array path (e.g., ["type", "id"]) that points to the select value inside the item
 *  - inputComponent?     : Component to render for the input field ("textarea" or any other Ant Design Input)
 *  - inputProps?         : Additional props forwarded to the input component
 *  - uniqueSelect        : If true, each select option can be chosen only once across the list
 */
function DynamicListSection({
    className,
    id,
    form,
    title,
    fieldName,
    inputPlaceholder = '',
    selectPlaceholder = 'Select type',
    selectAllowClear = true,
    addButtonLabel = 'Add',
    options = [],
    layout = 'horizontal',
    inputPath,
    selectPath,
    inputComponent,
    inputProps = {},
    uniqueSelect = false,
}) {
    const processedOptions = options.map(option => (
        option.icon ? {
            ...option,
            label: (
                <div className='select-option-with-icon'>
                    {option.icon}
                    {option.label}
                </div>
            ),
        } : option
    ));

    // Collect currently selected values (once per render) so we can exclude them from
    // option lists in other rows when `uniqueSelect` is enabled.
    // IMPORTANT: Keep the array length aligned with the fields' indices so that we can
    // reliably access the current row's value via `selectedValues[name]` later. This
    // prevents a mismatch that previously caused the current row's selected option to
    // disappear (showing the raw ID instead of the label) when earlier rows were empty.
    const selectedValues = (Form.useWatch(fieldName, form) || []).map(item => {
        if (!uniqueSelect || !selectPath) return undefined;
        return selectPath.reduce((acc, key) => acc?.[key], item);
    });

    const isEmpty = (Form.useWatch(fieldName, form) || []).length === 0;
    const hasTypeSelect = processedOptions.length > 0;
    const InputComponent = inputComponent === 'textarea' ? Input.TextArea : Input;

    // precompute blank item template
    const blankItemTemplate = useMemo(() => {
        const item = {};
        if (inputPath && inputPath.length) setDeep(item, inputPath, '');
        if (selectPath && selectPath.length) setDeep(item, selectPath, null);
        return item;
    }, [inputPath, selectPath]);

    const sectionBodyClass = cx(
        'dynamic-list-section',
        layout === 'vertical' && 'dynamic-list-section_vertical',
        !hasTypeSelect && 'dynamic-list-section_no-type',
        className,
        isEmpty && 'dynamic-list-section_hidden'
    );

    return (
        <NestedSection className={className} id={id}>
            <NestedSection.Header>
                <div>{title}</div>
                <Form.Item>
                    <Button
                        color='primary'
                        variant='text'
                        onClick={() => {
                            const list = form.getFieldValue(fieldName) || [];
                            form.setFieldsValue({
                                [fieldName]: [...list, { ...blankItemTemplate }],
                            });
                        }}
                    >
                        {addButtonLabel}
                    </Button>
                </Form.Item>
            </NestedSection.Header>

            <NestedSection.Body className={sectionBodyClass}>
                <Form.List name={fieldName}>
                    {(fields, { remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <div className='dynamic-list-section__item' key={`${fieldName}.${key}`}>
                                    <div className='dynamic-list-section__item-data'>
                                        {hasTypeSelect && selectPath && (
                                            <Form.Item {...restField} name={[name, ...selectPath]}>
                                                <Select
                                                    allowClear={selectAllowClear}
                                                    options={uniqueSelect ? (() => {
                                                        // Current value in this row so we don't block it.
                                                        const currentValue = selectedValues[name];
                                                        return processedOptions.filter(option => !selectedValues.includes(option.value) || option.value === currentValue);
                                                    })() : processedOptions}
                                                    placeholder={selectPlaceholder}
                                                />
                                            </Form.Item>
                                        )}
                                        {inputPath && (
                                            <Form.Item {...restField} name={[name, ...inputPath]}>
                                                <InputComponent placeholder={inputPlaceholder} {...inputProps} />
                                            </Form.Item>
                                        )}
                                    </div>
                                    <div className='dynamic-list-section__item-controls'>
                                        <Button
                                            className='form__icon-button'
                                            type='text'
                                            icon={<IconDelete />}
                                            onClick={() => remove(name)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </Form.List>
            </NestedSection.Body>
        </NestedSection>
    );
}

export default DynamicListSection;
