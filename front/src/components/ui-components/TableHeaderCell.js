import './TableHeaderCell.css';
import '../../helpers/shared.css';

import { ReactComponent as IconArrow } from '../../assets/icons/arrow-sort-direction.svg';

function TableHeaderCell(props) {
    const onClick = () => {
        props.onClick(props.sortColumn);
    }

    let icon = '';

    if (props.order.column === props.sortColumn) {
        icon = <IconArrow className={props.order.asc ? '' : 'table-header-cell--icon-flipped'} />
    }

    return (
        <div className='table-header-cell' onClick={onClick}>
            <div>{props.text}</div>
            <div>{icon}</div>
        </div>
    );
}

export default TableHeaderCell;