import './Filter.css';

import { useEffect, useState } from 'react';

import Filter from './Filter';

import { Slider } from 'antd';

function WeightFilter(props) {
    const min = 15;
    const max = 180;
    const [isApplied, setIsApplied] = useState(false);

    useEffect(() => {
        if (
            Array.isArray(props.selectedItems) &&
            props.selectedItems.length === 2
        ) {
            const isDefault = props.selectedItems[0] === min && props.selectedItems[1] === max;
            setIsApplied(!isDefault);
        }
    }, [props.selectedItems, min, max]);

    const onChangeComplete = (values) => {
        const isDefault = values[0] === min && values[1] === max;

        if (!isDefault) {
            setIsApplied(true);
            props.setFiltered(values);
            sessionStorage.setItem('talentsPage.filteredWeights', JSON.stringify(values));
        }
        else {
            setIsApplied(false);
            props.setFiltered([]);
            sessionStorage.setItem('talentsPage.filteredWeights', JSON.stringify([]));
        }
    };

    return (
        <Filter
            title='Weight'
            contentInHeader={true}
            uniqueName={props.uniqueName}
            applied={isApplied}
        >
            <Slider
                range
                min={min}
                max={max}
                defaultValue={
                    props.selectedItems && props.selectedItems.length === 2
                        ? props.selectedItems
                        : [min, max]
                }
                style={{ width: '120px' }}
                onChangeComplete={onChangeComplete}
            />
        </Filter>
    );
}

export default WeightFilter;
