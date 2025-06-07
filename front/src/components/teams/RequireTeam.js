import { Outlet } from "react-router";
import { useCheckAuthQuery } from '../../api/authApi';
import { TeamSettingsProvider } from '../../context/TeamSettingsContext';
import NewTeam from "./NewTeam";
import Loading from "../ui-components/Loading";

const RequireTeam = () => {
    const { data: authData, isLoading } = useCheckAuthQuery();

    if (isLoading) {
        return <Loading />;
    }

    if (authData?.activeTeam !== null) {
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