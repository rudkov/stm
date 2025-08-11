import { apiSlice } from 'api/apiSlice';
import { formatFiltersRequest } from './requestFormatters';
import { formatTalentResponse, formatTalentLocationsResponse } from './responseFormatters';

export const talentsApi = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getTalents: builder.query({
            query: (filters = {}) => ({
                url: '/talents/search',
                method: 'POST',
                body: formatFiltersRequest(filters),
            }),
            providesTags: ['Talent'],
        }),
        getTalent: builder.query({
            query: ({ id }) => `/talents/${id}`,
            transformResponse: (response) => formatTalentResponse(response),
            providesTags: (result, error, { id }) => [{ type: 'Talent', id }],
        }),
        createTalent: builder.mutation({
            query: ({ values }) => ({
                url: '/talents',
                method: 'POST',
                body: values,
            }),
            invalidatesTags: ['Talent', 'TalentManager'],
        }),
        updateTalent: builder.mutation({
            query: ({ id, values }) => ({
                url: `/talents/${id}`,
                method: 'PUT',
                body: values,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Talent', id }, 'Talent', 'TalentManager'],
        }),
        deleteTalent: builder.mutation({
            query: ({ id }) => ({
                url: `/talents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Talent', 'TalentManager'],
        }),
        getTalentLocations: builder.query({
            query: () => '/talents/locations',
            transformResponse: (response) => formatTalentLocationsResponse(response),
            providesTags: ['TalentLocation'],
        }),
        updateTalentLocation: builder.mutation({
            query: ({ id, location }) => ({
                url: `/talents/${id}/locations/current`,
                method: 'PUT',
                body: { location },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Talent', id },
                'Talent',
                'TalentLocation'
            ],
        }),
        getTalentManagers: builder.query({
            query: () => '/talents/managers',
            providesTags: ['TalentManager'],
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
