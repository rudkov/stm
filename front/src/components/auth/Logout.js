import axios from 'axios';
import { useNavigate } from 'react-router';

import { useDispatch } from 'react-redux';
import { authActions } from "../../store/auth";

const Logout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const from = '/';

    axios({
        method: 'post',
        url: '/api/v1/logout',
    })
        .then(function (response) {
            dispatch(authActions.logout());
            navigate(from, { replace: true });
        })
        .catch(function (error) {
            console.log(error);
        });

    return (
        <></>
    );
}

export default Logout;