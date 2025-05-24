//The import for 'Filter.css' is intentionally commented out in this file.
//This is because it would override styles in child components.
//Instead, the CSS file should be imported directly in each child component that needs it.
//import './Filter.css';
import '../../helpers/shared.css';

import { useState } from 'react';
import { Tooltip, Switch } from 'antd';

import { ReactComponent as IconCircle } from '../../assets/icons/circle.svg';
import { ReactComponent as IconCrossInCircle } from '../../assets/icons/cross-in-circle.svg';
import { ReactComponent as IconChevronUp } from '../../assets/icons/chevron-up.svg';
import { ReactComponent as IconChevronDown } from '../../assets/icons/chevron-down.svg';

function Filter({ children, className = '', ...props }) {
    const [collapsed, setCollapsed] = useState(JSON.parse(localStorage.getItem(props.uniqueName)) ?? false);

    const toggleFilter = () => {
        setCollapsed(!collapsed);
        localStorage.setItem(props.uniqueName, JSON.stringify(!collapsed));
    }

    const clearFilter = (item) => {
        item.stopPropagation();
        props.clearFilter(item);
    }

    return (
        <div className='filter'>
            <div className={`filter__header ${!props.contentInHeader ? 'filter__header_collapsable' : ''}`} onClick={props.contentInHeader !== true ? toggleFilter : null}>
                <div className='filter-header__left'>
                    <div className='filter-header__title'>{props.title}</div>
                    {props.applied ? <div className='icon filter-header__badge'><IconCircle /></div> : ''}
                </div>
                <div className='filter-header__right'>
                    {props.contentInHeader !== true ? (
                        props.applied ? (
                            <Tooltip title='Clear filter' placement='bottom' arrow={false} mouseEnterDelay={0.5}>
                                <button onClick={clearFilter} className='filter-header__button'>
                                    <div className='icon filter-header__icon'><IconCrossInCircle /></div>
                                </button>
                            </Tooltip>
                        ) : ''
                    ) : (
                        collapsed ? null : children
                    )}
                    {props.contentInHeader !== true && (
                        collapsed ?
                            <div className='icon filter-header__icon'><IconChevronDown /></div> :
                            <div className='icon filter-header__icon'><IconChevronUp /></div>
                    )}
                </div>
            </div>
            {props.contentInHeader !== true ?
                <div className={`filter__body ${className} ${collapsed ? 'filter__body_hidden' : ''}`}>
                    {children}
                </div>
                : ''
            }
        </div>
    );
}

export default Filter;
