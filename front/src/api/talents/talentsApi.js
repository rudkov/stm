import { apiSlice } from 'api/apiSlice';
import { transformFilters } from './requestFormatters';
import { prepareTalent, prepareTalentLocations } from './responseFormatters';

export const talentsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTalents: builder.query({
            query: (filters = {}) => ({
                url: '/talents/search',
                method: 'POST',
                body: transformFilters(filters),
            }),
            providesTags: ['Talent'],
        }),
        getTalentLocations: builder.query({
            query: () => '/talents/locations',
            transformResponse: (response) => prepareTalentLocations(response),
            providesTags: ['TalentLocation'],
        }),
        getTalentManagers: builder.query({
            query: () => '/talents/managers',
            providesTags: ['TalentManager'],
        }),
        getTalent: builder.query({
            query: (id) => `/talents/${id}`,
            transformResponse: (response) => prepareTalent(response),
            providesTags: (result, error, id) => [{ type: 'Talent', id }],
        }),
        createTalent: builder.mutation({
            query: (values) => ({
                url: '/talents',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['Talent'],
        }),
        updateTalent: builder.mutation({
            query: ({ id, ...values }) => ({
                url: `/talents/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Talent', id }],
        }),
        deleteTalent: builder.mutation({
            query: (id) => ({
                url: `/talents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Talent'],
        }),
        updateTalentLocation: builder.mutation({
            query: ({ id, location }) => ({
                url: `/talents/${id}/locations/current`,
                method: 'PUT',
                body: { location },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Talent', id },
                'TalentLocation'
            ],
        }),
    }),
});

export const {
    useGetTalentsQuery,
    useGetTalentLocationsQuery,
    useGetTalentManagersQuery,
    useGetTalentQuery,
    useCreateTalentMutation,
    useUpdateTalentMutation,
    useDeleteTalentMutation,
    useUpdateTalentLocationMutation,
} = talentsApi;
