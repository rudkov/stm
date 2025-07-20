import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const registerApi = createApi({
    reducerPath: 'registerApi',
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            })
        }),
        
    }),
});

export const { useRegisterMutation } = registerApi; 