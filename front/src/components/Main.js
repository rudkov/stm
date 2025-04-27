import './Main.css';

import { useState } from 'react';
import { Outlet } from 'react-router';

import Menu from './Menu';

function Main() {
    const [collapsedMenu, setCollapsedMenu] = useState(JSON.parse(localStorage.getItem('mainMenu.isCollapsed')) ?? false);

    const toggleMenu = () => {
        localStorage.setItem('mainMenu.isCollapsed', JSON.stringify(!collapsedMenu));
        setCollapsedMenu(!collapsedMenu);
    }

    return (
        <div className={`main ${collapsedMenu ? 'main_menu-collapsed' : ''}`}>
            <Menu toggleMenu={toggleMenu} isCollapsed={collapsedMenu} />
            <Outlet />
        </div>
    );
}

export default Main;