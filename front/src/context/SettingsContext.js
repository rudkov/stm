import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

import Loading from "../components/ui-components/Loading";
import { useNotification } from "../components/notifications/NotificationProvider";
const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const showNotification = useNotification();

  useEffect(() => {
      axios({
          method: 'get',
          url: '/api/v1/settings',
      }).then(response => {
          setSettings(response.data);
          setLoading(false);
      }).catch(error => {
          // FIXME: Look for better way to handle this
          showNotification({ type: "ERROR", message: "Could not load settings" });
      });
  }, []);

  if (loading) return <Loading />;

  return (
    <SettingsContext.Provider value={{settings}}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (!context) {
      throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
