import './DataCell.css';
import '../../helpers/shared.css';

function DataCell(props) {
    let label = '';
    let info = '';
    let icon = '';
    let value = '';

    if (props.label) {
        label = <div className='datacell--label'>{props.label}</div>;
    }

    if (props.info) {
        info = <span className='text-light'><span className='text-separator'>·</span>{props.info}</span>;
    }

    if (props.icon) {
        icon = <span className='datacell--value-icon'>{props.icon}</span>;
    }

    if (props.value) {
        value =
            <div className='datacell--value-container'>
                {icon}<div className='datacell--value'>{props.value}{info}</div>
            </div>
            ;
    }

    if (props.noLabel && !props.icon) {
        value =
            <div className='datacell--value-container'>
                {icon}<div className='datacell--value datacell--value-placeholder'>{props.value}{info}</div>
            </div>
            ;
    }

    return (
        <div className={props?.className}>
            {label}
            {value}
        </div>
    );
}

export default DataCell;