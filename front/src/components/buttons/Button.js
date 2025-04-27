import './Button.css';

import { Tooltip } from 'antd';

function Button(props) {
    let isSmall = '';
    let isActive = '';
    const tooltip = props.tooltip;
    const title = props.title;
    const Icon = props.icon;

    if (props.isSmall === true) {
        isSmall = 'button--small';
    }

    if (props.isActive === true) {
        isActive = 'button--active';
    }

    const Item = (data) => {
        if (Icon) {
            return (
                <button className={`button button--icon ${isSmall} ${isActive}`} onClick={clickHandler.bind(this, props)}>
                    <Icon />
                </button>
            );
        }
        else if (title) {
            let className = '';
            if (props.type && props.type === 'primary') {
                className = 'button--primary';
            }
            return (
                <button className={`button button--text ${className}`} onClick={clickHandler.bind(this, props)}>
                    {title}
                </button>
            );
        }
    };

    const clickHandler = (data) => {
        if (props.onClick) {
            props.onClick(data);
        }
    };

    return (
        <Tooltip placement="right" title={tooltip}>
            <Item />
        </Tooltip>
    );
}

export default Button;