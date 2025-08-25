import './SettingsMenu.css';

import { NavLink } from 'react-router';

import { ReactComponent as IconAccount } from 'assets/icons/account.svg';
import { ReactComponent as IconAppearance } from 'assets/icons/appearance.svg';
import { ReactComponent as IconBilling } from 'assets/icons/credit-card.svg';
import { ReactComponent as IconPeople } from 'assets/icons/users.svg';
import { ReactComponent as IconTeam } from 'assets/icons/team.svg';

function SettingsMenu() {
    return (
        <div className='settings-menu'>
            <div className='settings-menu__items'>
                <div className='settings-menu-header settings-menu-item_disabled'>
                    Account
                </div>
                <span to='general' className='settings-menu-item settings-menu-item_disabled'>
                    <div className='settings-menu-item__icon'><IconAccount /></div>
                    <div className='settings-menu-item__text'>General</div>
                </span>
                <span to='appearance' className='settings-menu-item settings-menu-item_disabled'>
                    <div className='settings-menu-item__icon'><IconAppearance /></div>
                    <div className='settings-menu-item__text'>Appearance</div>
                </span>
            </div>
            <div className='settings-menu__items'>
                <div className='settings-menu-header'>
                    Workspace
                </div>
                <span to='agency' className='settings-menu-item settings-menu-item_disabled'>
                    <div className='settings-menu-item__icon'><IconTeam /></div>
                    <div className='settings-menu-item__text'>Agency</div>
                </span>
                <NavLink to='people' className='settings-menu-item'>
                    <div className='settings-menu-item__icon'><IconPeople /></div>
                    <div className='settings-menu-item__text'>People</div>
                </NavLink>
                <span to='billing' className='settings-menu-item settings-menu-item_disabled'>
                    <div className='settings-menu-item__icon'><IconBilling /></div>
                    <div className='settings-menu-item__text'>Billing</div>
                </span>
            </div>
        </div>
    );
}

export default SettingsMenu;
