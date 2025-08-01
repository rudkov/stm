import './Menu.css';

import { NavLink } from 'react-router';
import { Tooltip } from 'antd';

import { useTheme } from '../context/ThemeContext';

import { ReactComponent as IconTalents } from '../assets/icons/talents.svg';
import { ReactComponent as IconCalendar } from '../assets/icons/calendar.svg';
import { ReactComponent as IconCompanies } from '../assets/icons/companies.svg';
import { ReactComponent as IconContacts } from '../assets/icons/contacts.svg';
import { ReactComponent as IconLogout } from '../assets/icons/logout.svg';
import { ReactComponent as IconLeftPanelOpen } from '../assets/icons/left-panel-open.svg';
import { ReactComponent as IconLeftPanelClose } from '../assets/icons/left-panel-close.svg';
import { ReactComponent as IconThemeLightMode } from '../assets/icons/theme-light-mode.svg';
import { ReactComponent as IconThemeDarkMode } from '../assets/icons/theme-dark-mode.svg';

function Menu(props) {
    const { theme, toggleTheme } = useTheme();
    document.documentElement.setAttribute('data-theme', theme);

    const toggleMenu = () => {
        props.toggleMenu();
    }

    return (
        <div className={`menu ${props.isCollapsed ? 'menu_collapsed' : ''}`}>
            <div className='menu__items menu__items-top'>
                <Tooltip title={props.isCollapsed ? 'Talents' : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <NavLink to='talents' className='menu-item'>
                        <div className='menu-item__icon'><IconTalents /></div>
                        <div className='menu-item__text'>Talents</div>
                    </NavLink>
                </Tooltip>
                <Tooltip title={props.isCollapsed ? 'Calendar' : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <NavLink to='calendar' className='menu-item'>
                        <div className='menu-item__icon'><IconCalendar /></div>
                        <div className='menu-item__text'>Calendar</div>
                    </NavLink>
                </Tooltip>
                <Tooltip title={props.isCollapsed ? 'Companies' : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <NavLink to='companies' className='menu-item'>
                        <div className='menu-item__icon'><IconCompanies /></div>
                        <div className='menu-item__text'>Companies</div>
                    </NavLink>
                </Tooltip>
                <Tooltip title={props.isCollapsed ? 'Contacts' : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <NavLink to='contacts' className='menu-item'>
                        <div className='menu-item__icon'><IconContacts /></div>
                        <div className='menu-item__text'>Contacts</div>
                    </NavLink>
                </Tooltip>
            </div>
            <div className='menu__items menu__items-bottom'>
                <Tooltip title={props.isCollapsed ? 'Log out' : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <NavLink to='/logout' className='menu-item'>
                        <div className='menu-item__icon'><IconLogout /></div>
                        <div className='menu-item__text'>Log out</div>
                    </NavLink>
                </Tooltip>
                <Tooltip title={props.isCollapsed ? ((theme === 'dark') ? 'Light mode' : 'Dark mode') : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <button onClick={toggleTheme} className='menu-item'>
                        <div className='menu-item__icon'>
                            {(theme === 'dark') ? <IconThemeLightMode /> : <IconThemeDarkMode />}
                        </div>
                        <div className='menu-item__text'>
                            {(theme === 'dark') ? 'Light mode' : 'Dark mode'}
                        </div>
                    </button>
                </Tooltip>
                <Tooltip title={props.isCollapsed ? 'Collapse menu' : ''} placement='right' arrow={false} mouseEnterDelay={0.5}>
                    <button onClick={toggleMenu} className='menu-item'>
                        <div className='menu-item__icon'>
                            {props.isCollapsed ? <IconLeftPanelOpen /> : <IconLeftPanelClose />}
                        </div>
                        <div className='menu-item__text'>Collapse menu</div>
                    </button>
                </Tooltip>
            </div>
        </div>
    );
}

export default Menu;