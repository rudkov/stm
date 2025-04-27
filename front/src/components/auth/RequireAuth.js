import { useLocation, Navigate, Outlet } from "react-router";
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';

import { authActions } from "../../store/auth";
import Loading from "../ui-components/Loading";

const RequireAuth = () => {
    const location = useLocation();

    const dispatch = useDispatch();
    let isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    let isLoading = useSelector((state) => state.auth.isLoading);

    if(!isAuthenticated && isLoading) {
        axios({
            method: 'get',
            url: '/api/v1/is-logged-in',
        })
            .then(function (response) {
                let data = response.data;
                dispatch(authActions.login({ data }));
            })
            .catch(function (error) {
            })
            .finally(function () {
                dispatch(authActions.stopLoading());
            });
    }

    if (isLoading && !isAuthenticated) {
        return <Loading />;
    }
    else if (isAuthenticated) {
        return <Outlet />;
    }
    else {
        return <Navigate to='/login' state={{ from: location }} replace />;
    }
}

export default RequireAuth;