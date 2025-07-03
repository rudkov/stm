import { Outlet } from "react-router";
import { useSelector } from 'react-redux';

import { TeamSettingsProvider } from '../../context/TeamSettingsContext';

import NewTeam from "./NewTeam";

const RequireTeam = () => {
    let activeTeam = useSelector((state) => state.auth.activeTeam);

    if (activeTeam !== null) {
        return (
            <TeamSettingsProvider>
                <Outlet />
            </TeamSettingsProvider>
        );
    }
    else {
        return <NewTeam />;
    }
}

export default RequireTeam;