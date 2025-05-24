import './Flag.css'

import { useEffect, useState } from 'react';
import Placeholder from '../../assets/flags/placeholder.svg';

export const Flag = ({ country }) => {
    const [src, setSrc] = useState(Placeholder);

    useEffect(() => {
        import(`../../assets/flags/${country}.svg`)
            .then((module) => setSrc(module.default))
            .catch(() => setSrc(Placeholder));
    }, [country]);

    return <img src={src} className="flag" alt={`${country} flag`} />;
};