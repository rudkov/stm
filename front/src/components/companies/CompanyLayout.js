import './CompanyLayout.css';

import { Outlet } from 'react-router';

import CompanyView from './CompanyView';

function CompanyLayout() {
    return (
        <div className='company-layout'>
            <CompanyView inLayout={true} />
            <Outlet />
        </div>
    );
}

export default CompanyLayout;
