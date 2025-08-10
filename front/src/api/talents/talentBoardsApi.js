import { apiSlice } from 'api/apiSlice';

export const talentBoardsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTalentBoards: builder.query({
            query: () => '/talent-boards',
            providesTags: ['TalentBoard'],
        }),
        getTalentBoard: builder.query({
            query: (id) => `/talent-boards/${id}`,
            providesTags: (result, error, id) => [{ type: 'TalentBoard', id }],
        }),
        createTalentBoard: builder.mutation({
            query: (values) => ({
                url: '/talent-boards',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['TalentBoard'],
        }),
        updateTalentBoard: builder.mutation({
            query: ({ id, ...values }) => ({
                url: `/talent-boards/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'TalentBoard', id }],
        }),
        deleteTalentBoard: builder.mutation({
            query: (id) => ({
                url: `/talent-boards/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['TalentBoard'],
        }),
    }),
});

export const {
    useGetTalentBoardsQuery,
    useGetTalentBoardQuery,
    useCreateTalentBoardMutation,
    useUpdateTalentBoardMutation,
    useDeleteTalentBoardMutation,
} = talentBoardsApi;
