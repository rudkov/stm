import { useLocation, Navigate, Outlet } from "react-router";
import { useCheckAuthQuery } from "../../api/authApi";
import Loading from "../ui-components/Loading";

const RequireAuth = () => {
    const location = useLocation();
    const { data: authData, isLoading } = useCheckAuthQuery();

    if (isLoading) {
        return <Loading />;
    }

    if (authData?.isAuthenticated) {
        return <Outlet />;
    }

    const currentPath = location.pathname + location.search;
    const encodedFrom = encodeURIComponent(currentPath);
    
    return <Navigate to={`/login?from=${encodedFrom}`} state={{ from: location }} replace />;
};

export default RequireAuth;