import './Contacts.css';

import { Splitter } from 'antd';
import { Outlet } from 'react-router';

import ContactsList from '../contacts/ContactsList';

function Contacts() {
    if (localStorage.getItem("contactsPagePanelSize") === null) {
        localStorage.setItem("contactsPagePanelSize", "50%");
    }

    const panelResized = (item) => {
        let panelSizePercentage = item[0] * 100 / (item[0] + item[1]);
        localStorage.setItem("contactsPagePanelSize", panelSizePercentage + "%");
    }
    return (
        <Splitter onResizeEnd={panelResized}>
            <Splitter.Panel defaultSize={localStorage.getItem("contactsPagePanelSize")} min="20%" max="80%">
                <ContactsList />
            </Splitter.Panel>
            <Splitter.Panel>
                <Outlet />
            </Splitter.Panel>
        </Splitter>
    );
}

export default Contacts;