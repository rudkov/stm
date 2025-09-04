import { apiSlice } from 'api/apiSlice';

export const usersApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getUsers: builder.query({
            query: () => ({
                url: '/users/search',
                method: 'POST',
            }),
            providesTags: ['User'],
        }),
    }),
});

export const {
    useGetUsersQuery,
} = usersApi;
