import { Navigate } from "react-router";
import { useCheckAuthQuery } from 'api/accountApi';
import Loading from "components/ui-components/Loading";

const RedirectIfTeam = ({ children }) => {
    const { data: authData, isLoading } = useCheckAuthQuery();

    if (isLoading) {
        return <Loading />;
    }

    if (authData?.activeTeam !== null) {
        return <Navigate to="/app" replace />;
    }

    return children;
};

export default RedirectIfTeam;