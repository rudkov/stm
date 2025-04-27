import { Outlet } from "react-router";
import { useSelector } from 'react-redux';

import NewTeam from "./NewTeam";

const RequireTeam = () => {
    let activeTeam = useSelector((state) => state.auth.activeTeam);

    if (activeTeam !== null) {
        return <Outlet />;
    }
    else {
        return <NewTeam />;
    }
}

export default RequireTeam;