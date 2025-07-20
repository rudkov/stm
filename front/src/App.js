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

import Companies from './components/pages/Companies';
import CompanyLayout from './components/companies/CompanyLayout';
import CompanyView from './components/companies/CompanyView';

import Contacts from './components/pages/Contacts';
import ContactLayout from './components/contacts/ContactLayout';
import ContactView from './components/contacts/ContactView';

import Events from './components/pages/Events';
import EventInfo from './components/events/EventInfo';

import Talents from './components/pages/Talents';
import TalentsZeroState from './components/talents/TalentsZeroState';
import TalentView from './components/talents/TalentView';

// import { default as TmpLogin } from './components/auth/tmp/Login';
// import { default as TmpRegister } from './components/auth/tmp/Register';
// import { default as TmpCreateTeam } from './components/auth/tmp/CreateTeam';
// import { default as TmpResetPassword } from './components/auth/tmp/ResetPassword';
// import { default as TmpResetPasswordStep2 } from './components/auth/tmp/ResetPasswordStep2';
// import { default as TmpResetPasswordStep3 } from './components/auth/tmp/ResetPasswordStep3';

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

                        {/* Temporary Auth Routes */}
                        {/* <Route path='tmp/login' element={<TmpLogin />} />
                        <Route path='tmp/register' element={<TmpRegister />} />
                        <Route path='tmp/create-team' element={<TmpCreateTeam />} />
                        <Route path='tmp/reset-password' element={<TmpResetPassword />} />
                        <Route path='tmp/reset-password-step-2' element={<TmpResetPasswordStep2 />} />
                        <Route path='tmp/reset-password-step-3' element={<TmpResetPasswordStep3 />} /> */}
                        {/* End of Temporary Auth Routes */}

                        <Route element={<RequireAuth />}>
                            <Route path='logout' element={<Logout />} />
                            
                            <Route element={<RequireTeam />}>

                                <Route path='app' element={<Main />}>

                                    <Route path='calendar' element={<Events />}>
                                        <Route path=':id' element={<EventInfo />} />
                                    </Route>

                                    <Route path='companies' element={<Companies />}>
                                        <Route path=':companyId' element={<CompanyLayout />}>
                                            <Route path=':contactId' element={<ContactView />} />
                                        </Route>
                                    </Route>

                                    <Route path='contacts' element={<Contacts />}>
                                        <Route path=':contactId' element={<ContactLayout />}>
                                            <Route path=':companyId' element={<CompanyView />} />
                                        </Route>
                                    </Route>

                                    <Route path='talents' element={<Talents />}>
                                        <Route index element={<TalentsZeroState />} />
                                        <Route path=':id' element={<TalentView />} />
                                    </Route>

                                </Route>

                            </Route>

                            <Route path='app/teams/create' element={<NewTeam />} />
                        </Route>

                        <Route path='*' element={<>404</>} />
                    </Routes>
                </SettingsProvider>
            </NotificationProvider>
        </ConfigProvider>
    );
}

export default App;
