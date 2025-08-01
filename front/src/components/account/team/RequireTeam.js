import { Navigate, Outlet } from "react-router";
import { useCheckAuthQuery } from 'api/accountApi';
import { TeamSettingsProvider } from 'context/TeamSettingsContext';
import Loading from "components/ui-components/Loading";

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
        return <Navigate to="/create-team" replace />;
    }
}

export default RequireTeam;