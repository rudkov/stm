import './CustomSelect.css';

import { Button, Input, Select } from 'antd';
import { useRef, useState } from 'react';

function CustomSelect({
    value,
    onChange,
    className,
    options,
    onAddItem,
    inputPlaceholder = 'Enter new item',
    addButtonText = 'Add',
    allowClear = true,
    ...restProps
}) {
    const [newItemName, setNewItemName] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const inputRef = useRef(null);

    const onNewItemNameChange = (event) => {
        setNewItemName(event.target.value);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        if (newItemName.trim() && onAddItem) {
            const newItemId = onAddItem(newItemName);
            if (newItemId !== undefined && onChange) {
                onChange(newItemId);
            }
            setNewItemName('');
            setDropdownVisible(false);
        }
    };

    return (
        <Select
            className={className}
            allowClear={allowClear}
            value={value}
            onChange={onChange}
            options={options}
            open={dropdownVisible}
            onDropdownVisibleChange={(visible) => setDropdownVisible(visible)}
            dropdownRender={menu => (
                <>
                    {menu}
                    <div className='custom-select__footer'>
                        <Input
                            placeholder={inputPlaceholder}
                            ref={inputRef}
                            value={newItemName}
                            onChange={onNewItemNameChange}
                            onKeyDown={e => {
                                e.stopPropagation();
                                if (e.key === 'Enter') {
                                    handleAddItem(e);
                                }
                            }}
                        />
                        <Button type='text' onClick={handleAddItem}>
                            {addButtonText}
                        </Button>
                    </div>
                </>
            )}
            {...restProps}
        />
    );
}

export default CustomSelect;
