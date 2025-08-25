import './Settings.css';

import { Outlet } from 'react-router';

import SettingsMenu from 'components/settings/SettingsMenu';

function Settings() {
    return (
        <div className='settings-page'>
            <div className='settings-page__content'>
                <div className='settings-page__left-column'>
                    <SettingsMenu />
                </div>
                <div className='settings-page__right-column'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default Settings;
