import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery  from './baseQuery';


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: {
                    ...credentials,
                    remember: true,
                },
            }),
            invalidatesTags: ['Auth'],
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),
        checkAuth: builder.query({
            query: () => '/is-logged-in',
            providesTags: ['Auth'],
            transformResponse: (response) => ({
                isAuthenticated: response.is_authenticated,
                activeTeam: response.user?.team_id || null,
                hasVerifiedEmail: response.user?.email_verified_at != null,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useCheckAuthQuery,
} = authApi; 