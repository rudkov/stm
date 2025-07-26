import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './baseQuery';

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQuery,
    tagTypes: ['Auth'],
    endpoints: (builder) => ({
        // Auth endpoints
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
                user: response.user,
                activeTeam: response.user?.team_id || null,
                hasVerifiedEmail: response.user?.email_verified_at != null,
            }),
        }),
        // Register endpoints
        register: builder.mutation({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            })
        }),
        // Email verify endpoints
        verifyEmail: builder.mutation({
            query: ({ id, hash, expires, signature }) => ({
                url: `/email-verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
                method: 'GET',
            }),
            invalidatesTags: ['Auth'],
        }),
        resendEmail: builder.mutation({
            query: () => ({
                url: '/email-verify/resend',
                method: 'POST',
            }),
            transformResponse: (returnValue, meta) => ({
                status: meta.response?.status,
            }),
        }),
        // Password reset endpoints
        forgotPassword: builder.mutation({
            query: (email) => ({
                url: '/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, email, password }) => ({
                url: '/reset-password',
                method: 'POST',
                body: { token, email, password, password_confirmation: password },
            }),
            transformErrorResponse: (response) => {
                const originalErrors = response?.data?.errors || {};
                const messages = Object.values(originalErrors)
                  .flat()
                  .filter(Boolean);

                const fieldErrors = (response?.fieldErrors || []).map(({ errors }) => ({
                    name: 'password',
                    errors,
                }));
                return {
                  ...response,
                  data: {
                    errors: {
                        password: messages, 
                    },
                  },
                  fieldErrors,
                };
            },
        }),
        // Create team endpoint
        createTeam: builder.mutation({
            query: (name) => ({
                url: '/teams',
                method: 'POST',
                body: { name },
            }),
            invalidatesTags: ['Auth'],
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useCheckAuthQuery,
    useRegisterMutation,
    useVerifyEmailMutation,
    useResendEmailMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useCreateTeamMutation,
} = accountApi; 