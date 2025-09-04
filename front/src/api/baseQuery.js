import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const getCsrfToken = () => {
    const cookies = document.cookie.split(';');
    const xsrfCookie = cookies.find(cookie => cookie.trim().startsWith('XSRF-TOKEN='));
    if (xsrfCookie) {
        return decodeURIComponent(xsrfCookie.split('=')[1]);
    }
    return null;
};

const baseQuery = async (args, api, extraOptions) => {
    const fetch = fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_URL}/api/v1`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = getCsrfToken();
            if (token) {
                headers.set('X-XSRF-TOKEN', token);
            }
            headers.set('Accept', 'application/json');
            return headers;
        },
    });

    const result = await fetch(args, api, extraOptions);

    if (result.error) {
        const status = result.error.status;
        switch (status) {
            case 401: {
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
                break;
            }
            case 419: {
                try {
                    await window.fetch(`${process.env.REACT_APP_URL}/sanctum/csrf-cookie`, {
                        credentials: 'include',
                    });
                    return await fetch(args, api, extraOptions);
                } catch (e) {
                }
                break;
            }
            default:
                break;
        }
    }

    return result;
};

export default baseQuery;
