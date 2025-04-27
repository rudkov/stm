import './IconColorBadge.css';

function IconColorBadge(props) {

    return (
        <div className={'color--badge ' + props.color}></div>
    );
}

export default IconColorBadge;