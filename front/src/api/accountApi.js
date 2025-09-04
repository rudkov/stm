import { apiSlice } from './apiSlice';

export const accountApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // Auth endpoints
        login: builder.mutation({
            query: ({ email, password }) => ({
                url: '/login',
                method: 'POST',
                body: { email, password, remember: true },
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
            query: () => '/check-auth',
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
            query: ({ name, email, password }) => ({
                url: '/register',
                method: 'POST',
                body: { name, email, password },
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
