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
        verifyEmail: builder.mutation({
            query: ({ id, hash, expires, signature }) => ({
                url: `/email-verify/${id}/${hash}?expires=${expires}&signature=${signature}`,
                method: 'GET',
            }),
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
    }),
});

export const { useRegisterMutation, useVerifyEmailMutation, useResendEmailMutation } = registerApi;  