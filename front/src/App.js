import './App.css';
import { Routes, Route } from 'react-router';
import { ConfigProvider, theme as AntdTheme } from 'antd';

import { useTheme } from "./context/ThemeContext";
import { SettingsProvider } from './context/SettingsContext';

import NotificationProvider from './components/notifications/NotificationProvider';

import RequireAuth from './components/auth/RequireAuth';
import RequireTeam from './components/teams/RequireTeam';
import Login from './components/auth/Login';
import Logout from './components/auth/Logout';
import Register from './components/auth/Register';
import Main from './components/Main';

import Contacts from './components/pages/Contacts';
import CompanyView from './components/contacts/CompanyView';

import Events from './components/pages/Events';
import EventInfo from './components/events/EventInfo';

import Talents from './components/pages/Talents';
import TalentsZeroState from './components/talents/TalentsZeroState';
import TalentView from './components/talents/TalentView';

import NewTeam from './components/teams/NewTeam';

import Tmp from './components/pages/Tmp';

function App() {
    const { theme } = useTheme();
    return (
        <ConfigProvider theme={{ algorithm: theme === 'dark' ? AntdTheme.darkAlgorithm : AntdTheme.defaultAlgorithm }}>
            <NotificationProvider>
                <SettingsProvider>
                    <Routes>
                        <Route index element={<Tmp />} />
                        <Route path='login' element={<Login />} />
                        <Route path='register' element={<Register />} />

                        <Route element={<RequireAuth />}>

                            <Route element={<RequireTeam />}>

                                <Route path='app' element={<Main />}>

                                    <Route path='calendar' element={<Events />}>
                                        <Route path=':id' element={<EventInfo />} />
                                    </Route>

                                    <Route path='contacts' element={<Contacts />}>
                                        <Route path=':id' element={<CompanyView />} />
                                    </Route>

                                    <Route path='talents' element={<Talents />}>
                                        <Route index element={<TalentsZeroState />} />
                                        <Route path=':id' element={<TalentView />} />
                                    </Route>

                                </Route>

                            </Route>

                            <Route path='app/teams/create' element={<NewTeam />} />
                            <Route path='app/logout' element={<Logout />} />

                        </Route>

                        <Route path='*' element={<>404</>} />
                    </Routes>
                </SettingsProvider>
            </NotificationProvider>
        </ConfigProvider>
    );
}

export default App;
