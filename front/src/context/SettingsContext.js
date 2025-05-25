import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import Loading from "../components/ui-components/Loading";
import { useNotification } from "../components/notifications/NotificationProvider";
const SettingsContext = createContext(null);

const talentPreferences = [
    {
        system_name: 'is_faithbased_ads',
        name: 'Faithbased ads',
    },
    {
        system_name: 'is_fur',
        name: 'Fur',
    },
    {
        system_name: 'is_gambling_ads',
        name: 'Gambling ads',
    },
    {
        system_name: 'is_lingerie',
        name: 'Lingerie',
    },
    {
        system_name: 'is_liquor_ads',
        name: 'Liquor ads',
    },
    {
        system_name: 'is_nude',
        name: 'Nude',
    },
    {
        system_name: 'is_political_ads',
        name: 'Political ads',
    },
    {
        system_name: 'is_smoking_ads',
        name: 'Smoking ads',
    },
    {
        system_name: 'is_sports',
        name: 'Sports',
    },
    {
        system_name: 'is_swimwear',
        name: 'Swimwear',
    },
    {
        system_name: 'is_topless',
        name: 'Topless',
    },
];

export function SettingsProvider({ children }) {
    const [settings, setSettings] = useState(null);
    const [loading, setLoading] = useState(true);
    const showNotification = useNotification();

    useEffect(() => {
        axios({
            method: 'get',
            url: '/api/v1/settings',
        }).then(response => {
            const mergedSettings = {
                ...response.data,
                talent_preferences: talentPreferences,
            };
            setSettings(mergedSettings);
            setLoading(false);
        }).catch(error => {
            // FIXME: Look for better way to handle this
            showNotification({ type: 'ERROR', message: 'Could not load settings' });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading) return <Loading />;

    return (
        <SettingsContext.Provider value={{ settings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
