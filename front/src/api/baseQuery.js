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

    // Handle 422
    if (result.error?.status === 422 && result.error.data?.errors) {
        const fieldErrors = Object.entries(result.error.data.errors).map(([field, messages]) => ({
            name: field,
            errors: messages,
        }));

        result.error.isValidationError = true;
        result.error.fieldErrors = fieldErrors;
    }

    return result;
};

export default baseQuery;
