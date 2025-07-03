import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Loading from '../components/ui-components/Loading';
import { useNotification } from '../components/notifications/NotificationProvider';

const TeamSettingsContext = createContext(null);

export function TeamSettingsProvider({ children }) {
    const [teamSettings, setTeamSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const showNotification = useNotification();

    useEffect(() => {
        axios({
            method: 'get',
            url: '/api/v1/settings/team',
        }).then(response => {
            setTeamSettings(response.data);
            setLoading(false);
        }).catch(error => {
            // FIXME: Look for better way to handle this
            showNotification({ type: 'ERROR', message: 'Could not load team settings' });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <Loading />;

    return (
        <TeamSettingsContext.Provider value={{ teamSettings }}>
            {children}
        </TeamSettingsContext.Provider>
    );
}

export function useTeamSettings() {
    const context = useContext(TeamSettingsContext);
    if (!context) {
        throw new Error('useTeamSettings must be used within a TeamSettingsProvider');
    }
    return context;
}
